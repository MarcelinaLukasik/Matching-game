## Technologies
Project is created with:
* Python 3.10
* PostgreSQL 14


## Setup
To run this project, launch following commands:

python -m venv venv
.\venv\Scripts\Activate.ps1
pip install Flask
pip install -r requirements.txt
$env:FLASK_APP = "server"
flask run

## Note:
High score options will be available only with proper PostgreSQL configuration.
