from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL

# an Engine, which the Session will use for connection
# resources

url = URL.create(
    drivername = "mysql+pymysql",
    username = "root",
    password = "",
    host = "localhost",
    database = "series_cartoon",
    port = 3306

)

engine = create_engine(url)
Session = sessionmaker(engine)
session = Session()