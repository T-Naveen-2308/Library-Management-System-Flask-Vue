from flask import jsonify, request, current_app
from library_app import db, bcrypt, cache, ist
from library_app.models import User, Section, Book
from library_app.utils import (
    custom_sort,
    save_file,
    send_reset_email,
    form_errors,
    validate_file,
)
from library_app.main.forms import (
    SearchForm,
    ResetRequestForm,
    ResetPasswordForm,
    LoginForm,
    RegistrationForm,
)
from . import main
from datetime import datetime, timezone, timedelta
import jwt
import os


@main.route("/sections", methods=["GET"])
@cache.cached()
def sections():
    return (
        jsonify(
            {
                "sections": custom_sort(Section.query.all()),
                "datetime": datetime.now(ist).replace(tzinfo=None),
            }
        ),
        200,
    )


@main.route("/section/<int:sectionid>", methods=["GET"])
@cache.cached()
def section(sectionid):
    section = Section.query.get(sectionid)
    if not section:
        return jsonify({"error": f"Section {sectionid} not found"}), 404
    return (
        jsonify(
            {
                "section": section.to_dict(["books"]),
                "datetime": datetime.now(ist).replace(tzinfo=None),
            }
        ),
        200,
    )


@main.route("/books", methods=["GET"])
@cache.cached()
def books():
    return (
        jsonify(
            {
                "sections": custom_sort(Section.query.all(), ["books"], False),
                "datetime": datetime.now(ist).replace(tzinfo=None),
            }
        ),
        200,
    )


@main.route("/book/<int:bookid>", methods=["GET"])
@cache.cached()
def book(bookid):
    book = Book.query.get(bookid)
    if not book:
        return jsonify({"error": f"Book {bookid} not found"}), 404
    return (
        jsonify(
            {
                "book": book.to_dict(["feedbacks", "section", "pdf_file"]),
                "datetime": datetime.now(ist).replace(tzinfo=None),
            }
        ),
        200,
    )


@main.route("/search", methods=["POST"])
@cache.cached()
def search():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    data = request.get_json()
    if "search_term" not in data:
        return jsonify({"error": "Search term not provided"}), 400
    data["search_term"] = data["search_term"].strip()
    form = SearchForm(data=data)
    if form.validate():
        search_term = form.search_term.data
        return (
            jsonify(
                {
                    "sections": custom_sort(
                        Section.query.filter(
                            Section.title.ilike(f"%{search_term}%")
                        ).all()
                    ),
                    "books": custom_sort(
                        Book.query.filter(Book.title.ilike(f"%{search_term}%")).all()
                    ),
                    "authors": custom_sort(
                        Book.query.filter(Book.author.ilike(f"%{search_term}%")).all()
                    ),
                    "datetime": datetime.now(ist).replace(tzinfo=None),
                }
            ),
            200,
        )
    else:
        return (
            jsonify({"error": form_errors(form.errors)}),
            400,
        )


@main.route("/register", methods=["POST"])
def register():
    data = request.form.to_dict()
    form = RegistrationForm(data=data)
    if form.validate():
        profile_picture_data = request.files.get("profile_picture")
        if profile_picture_data:
            return_val = validate_file(profile_picture_data, "image")
            if return_val:
                return jsonify(return_val), 400
            profile_picture = save_file(
                profile_picture_data, os.path.join("user", "profile_pictures")
            )
        else:
            profile_picture = "default_profile_picture.png"
        user = User(
            name=form.name.data,
            email=form.email.data,
            username=form.username.data,
            password=form.password.data,
            profile_picture=profile_picture,
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": f"Account created for {form.username.data}!"}), 201
    else:
        return (
            jsonify({"error": form_errors(form.errors)}),
            400,
        )


@main.route("/login", methods=["POST"])
def login():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    data = request.get_json()
    if "role" not in data:
        return jsonify({"error": "Role is required"}), 400
    form = LoginForm(data=data)
    print(form.username.data)
    print(form.password.data)
    if form.validate():
        user = User.query.filter_by(username=form.username.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            if user.urole == "user" or user.urole == "librarian":
                if user.urole != data["role"]:
                    return (
                        jsonify({"roleError": "Role is not same."}),
                        400,
                    )
                try:
                    token = jwt.encode(
                        {
                            "userid": user.userid,
                            "exp": datetime.now(timezone.utc) + timedelta(days=1),
                        },
                        current_app.config["SECRET_KEY"],
                        algorithm="HS256",
                    )
                except Exception as e:
                    return (
                        jsonify(
                            {
                                "error": "An unexpected error has occurred. Please try again. Couldn't generate the token."
                            }
                        ),
                        400,
                    )
                user.authenticated = True
                db.session.commit()
                return (
                    jsonify({"message": "Logged in successfully.", "token": token}),
                    200,
                )
            else:
                return (
                    jsonify(
                        {
                            "error": "An unexpected error has occurred. Please try again. Role wrong."
                        }
                    ),
                    400,
                )
        else:
            return jsonify({"error": "Invalid Username or Password"}), 404
    else:
        return (
            jsonify({"error": form_errors(form.errors)}),
            400,
        )


@main.route("/reset", methods=["POST"])
def reset_request():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    data = request.get_json()
    form = ResetRequestForm(data=data)
    if form.validate():
        user = User.query.filter_by(email=form.email.data).first()
        token = jwt.encode(
            {
                "userid": user.userid,
                "exp": datetime.now(timezone.utc) + timedelta(seconds=1800),
            },
            current_app.config["SECRET_KEY"],
            algorithm="HS256",
        )
        send_reset_email(user, "main")
        return (
            jsonify(
                {
                    "message": "An email has been sent with instructions to reset your password.",
                    "token": token,
                }
            ),
            200,
        )
    else:
        return (
            jsonify({"error": form_errors(form.errors)}),
            400,
        )


@main.route("/password-reset/<token>", methods=["POST"])
def reset_password(token):
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    data = request.get_json()
    user = User.verify_reset_token(token)
    if user is None:
        return jsonify({"error": "That is an invalid or expired token."}), 400
    try:
        token2 = request.headers.get("Authorization")
        if not token2:
            return jsonify({"error": "Authorization header required."}), 401
        if token2.startswith("Bearer "):
            token2 = token2[len("Bearer ") :]
        print(token2)
        decoded_token = jwt.decode(
            token2, current_app.config["SECRET_KEY"], algorithms=["HS256"]
        )
        userid = decoded_token.get("userid")
        if user.userid != userid:
            return jsonify({"error": "Token does not match user."}), 400
    except:
        return (
            jsonify({"error": "An unexpected error has occurred. Please try again."}),
            400,
        )
    form = ResetPasswordForm(data=data)
    if form.validate():
        user.password = bcrypt.generate_password_hash(form.password.data).decode(
            "utf-8"
        )
        db.session.commit()
        return jsonify({"message": "Your password has been updated!"}), 201
    else:
        return (
            jsonify({"error": form_errors(form.errors)}),
            400,
        )
