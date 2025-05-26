from sqlalchemy.orm import Session
from sqlalchemy import desc
from . import models, schemas
from typing import List, Optional

def get_todos(db: Session, skip: int = 0, limit: int = 100) -> List[models.Todo]:
    """Récupérer tous les todos avec pagination"""
    return db.query(models.Todo).order_by(desc(models.Todo.created_at)).offset(skip).limit(limit).all()

def get_todo(db: Session, todo_id: int) -> Optional[models.Todo]:
    """Récupérer un todo par son ID"""
    return db.query(models.Todo).filter(models.Todo.id == todo_id).first()

def create_todo(db: Session, todo: schemas.TodoCreate) -> models.Todo:
    """Créer un nouveau todo"""
    db_todo = models.Todo(
        title=todo.title,
        description=todo.description,
        completed=todo.completed
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def update_todo(db: Session, todo_id: int, todo_update: schemas.TodoUpdate) -> Optional[models.Todo]:
    """Mettre à jour un todo existant"""
    db_todo = get_todo(db, todo_id)
    if not db_todo:
        return None
    
    # Mettre à jour seulement les champs fournis
    update_data = todo_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)
    
    db.commit()
    db.refresh(db_todo)
    return db_todo

def delete_todo(db: Session, todo_id: int) -> bool:
    """Supprimer un todo"""
    db_todo = get_todo(db, todo_id)
    if not db_todo:
        return False
    
    db.delete(db_todo)
    db.commit()
    return True

def get_todos_by_status(db: Session, completed: bool, skip: int = 0, limit: int = 100) -> List[models.Todo]:
    """Récupérer les todos par statut (complété ou non)"""
    return db.query(models.Todo).filter(models.Todo.completed == completed).order_by(desc(models.Todo.created_at)).offset(skip).limit(limit).all()