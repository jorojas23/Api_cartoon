from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
from typing import List
from serie import Serie
from db import session

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://127.0.0.1:8000",
    "http://127.0.0.1",
    "null"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Personaje(BaseModel):
    titulo: str
    creador: str
    cantidad_de_temporadas: int
    personajes_principales: str
    valoracion: str
    ano_de_transmision: str
    ano_de_finalizacion: str
    foto: str
              

@app.get("/")
async def root():
    return {"message": "¡Hola, FastAPI!"}

@app.get("/personajes/")
async def obtener_personajes():
    series = session.query(Serie).all()
    return series

@app.get("/personajes/{personaje_id}")
async def obtener_personaje(personaje_id: int):
    series = session.query(Serie).filter(personaje_id == Serie.id)
    serie = series.first()
    if serie is None:
        raise HTTPException(status_code=404, detail="Personaje no encontrado")
    return serie

@app.post("/personajes/")
async def crear_articulo(personaje: Personaje):
    serie = Serie(
        titulo=personaje.titulo,
        creador=personaje.creador,
        cantidad_de_temporadas=personaje.cantidad_de_temporadas,
        personajes_principales= personaje.personajes_principales,
        valoracion=personaje.valoracion,
        ano_de_transmision=personaje.ano_de_transmision,
        ano_de_finalizacion=personaje.ano_de_finalizacion,
        foto=personaje.foto
    )
    session.add(serie)
    session.commit()
    return {"todo agregado"}

@app.delete("/personajes/{personaje_id}")
async def eliminar_articulo(personaje_id: int):
    series = session.query(Serie).filter(personaje_id == Serie.id)
    serie = series.first()
    session.delete(serie)
    session.commit()
    return {"mensaje": "Artículo eliminado"}
@app.put("/personajes/{personaje_id}")
async def actualizar_serie(personaje_id: int, serie_actualizada: Personaje):
    series = session.query(Serie).filter(personaje_id == Serie.id)
    serie = series.first()
    serie.titulo=serie_actualizada.titulo
    serie.creador=serie_actualizada.creador
    serie.cantidad_de_temporadas=serie_actualizada.cantidad_de_temporadas
    serie.personajes_principales= serie_actualizada.personajes_principales
    serie.valoracion=serie_actualizada.valoracion
    serie.ano_de_transmision=serie_actualizada.ano_de_transmision
    serie.ano_de_finalizacion=serie_actualizada.ano_de_finalizacion
    serie.foto=serie_actualizada.foto
    session.add(serie)
    session.commit()
    return {"mensaje": "Serie actualizada correctamente", "serie": serie}