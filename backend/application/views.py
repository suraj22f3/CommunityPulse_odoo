from flask import jsonify, render_template, request
from flask_security import SQLAlchemyUserDatastore
from flask_security.utils import verify_password, hash_password

from application import models
from application.instances import cache
from application.extensions import db


def create_view(app, user_datastore : SQLAlchemyUserDatastore):

    #homepage

    @app.route('/')
    def home():
        return render_template('index.html')
    
    @app.route('/user_login',methods=["POST"])
    def user_login():
        data=request.get_json()
        email=data.get('email')
        password=data.get('password')

        if not email or not password:
            return jsonify({'message':'not valid email or password'}), 404
        
        user = user_datastore.find_user(email=email)
        
        if not user:
            return jsonify({'message':'invalid user'}),404
        
        if verify_password(password, user.password):
            return jsonify({'token':user.get_auth_token(), 'role':user.roles[0].name, 'id': user.id, 'email':user.email}),200
        else:
            return jsonify({'message':'wrong password'}),404
    
    
    @app.route('/register', methods=['POST'])
    def register():
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message" : "invalid input"})
        
        if user_datastore.find_user(email=email):
            return jsonify({"message" : "user already exists"})

        
        
        try:
            user_datastore.create_user(email = email, password = hash_password(password), role = "user")
            db.session.commit()
            cache.clear()
        except:
            print('error while creating')
            db.session.rollback()
            return jsonify({'message' : 'error while creating user'}), 408
        
        return jsonify({'message' : 'user created'}), 200