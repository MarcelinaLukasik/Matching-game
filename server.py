import json
from flask import Flask, render_template, request
import database_common

app = Flask(__name__)


@app.route("/", methods=['GET', 'POST'])
def home_page():
    return render_template("Home_page.html")


@app.route("/index", methods=['GET', 'POST'])
def game_board():
    return render_template("index.html")


@app.route("/High_score", methods=['GET', 'POST'])
def score():
    if request.method == 'POST':
        output = request.get_json()
        result = json.loads(output)
        user_score = result['score']
        user_name = result['name']
        save_user(user_name, user_score)
    users_scores = users_high_scores()
    return render_template("High_score.html", users_scores=users_scores)


@app.route("/About_game")
def about():
    return render_template("About_game.html")


@app.route("/About_game_pl")
def about_pl():
    return render_template("About_game_pl.html")


@database_common.connection_handler
def save_user(cursor, user_name, user_score):
    cursor.execute('INSERT INTO high_score (username, score) VALUES (%s, %s)', (user_name, user_score,))


@database_common.connection_handler
def users_high_scores(cursor):
    cursor.execute('SELECT username, score FROM high_score ORDER BY score DESC LIMIT 2;')
    return cursor.fetchall()

