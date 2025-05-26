from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, models, schemas
from ..database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.TodoResponse])
def read_todos(
    skip: int = Query(0, ge=0, description="Nombre d'éléments à ignorer"),
    limit: int = Query(100, ge=1, le=1000, description="Nombre maximum d'éléments à retourner"),
    completed: Optional[bool] = Query(None, description="Filtrer par statut de completion"),
    db: Session = Depends(get_db)
):
    """Récupérer tous les todos avec filtrage optionnel"""
    if completed is not None:
        todos = crud.get_todos_by_status(db, completed=completed, skip=skip, limit=limit)
    else:
        todos = crud.get_todos(db, skip=skip, limit=limit)
    return todos

@router.get("/{todo_id}", response_model=schemas.TodoResponse)
def read_todo(todo_id: int, db: Session = Depends(get_db)):
    """Récupérer un todo spécifique par son ID"""
    db_todo = crud.get_todo(db, todo_id=todo_id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo introuvable")
    return db_todo

@router.post("/", response_model=schemas.TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    """Créer un nouveau todo"""
    return crud.create_todo(db=db, todo=todo)

@router.put("/{todo_id}", response_model=schemas.TodoResponse)
def update_todo(
    todo_id: int, 
    todo: schemas.TodoUpdate, 
    db: Session = Depends(get_db)
):
    """Mettre à jour un todo existant"""
    db_todo = crud.update_todo(db, todo_id=todo_id, todo=todo)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo introuvable")
    return db_todo

@router.patch("/{todo_id}", response_model=schemas.TodoResponse)
def patch_todo(
    todo_id: int, 
    todo: schemas.TodoUpdate, 
    db: Session = Depends(get_db)
):
    """Mettre à jour partiellement un todo existant"""
    db_todo = crud.update_todo(db, todo_id=todo_id, todo=todo)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo introuvable")
    return db_todo

@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    """Supprimer un todo"""
    success = crud.delete_todo(db, todo_id=todo_id)
    if not success:
        raise HTTPException(status_code=404, detail="Todo introuvable")
    return None

@router.patch("/{todo_id}/edit", response_model=schemas.TodoResponse)
def toggle_edit_todo(todo_id: int, edit: schemas.TodoEdit, db: Session = Depends(get_db)):
    db_todo = crud.get_todo(db, todo_id=todo_id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Tâche non trouvée")
    if edit.is_editing and db_todo.is_editing and db_todo.last_modified_by != edit.last_modified_by:
        raise HTTPException(status_code=409, detail="La tâche est déjà en cours d'édition")
    return crud.update_todo_edit_state(db=db, todo_id=todo_id, edit=edit) 