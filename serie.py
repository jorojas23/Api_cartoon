from sqlalchemy import Integer, String, ForeignKey,Column
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import mapped_column
from db import engine


# declarative base class
Base = declarative_base()


# an example mapping using the base
class Serie(Base):
    __tablename__ = "series"
    id = Column(Integer, primary_key=True)
    titulo = Column(String(255))  # Especifica la longitud máxima
    creador = Column(String(255))  # Especifica la longitud máxima
    cantidad_de_temporadas = Column(Integer)
    personajes_principales =  Column(String(255))
    valoracion = Column(String(50))  # Especifica la longitud máxima
    ano_de_transmision = Column(String(100))  # Especifica la longitud máxima
    ano_de_finalizacion = Column(String(100))  # Especifica la longitud máxima
    foto = Column(String(255))
    
Base.metadata.create_all(engine)