from sqlalchemy.orm import Session
from sqlalchemy import desc
from . import models, schemas
from typing import List, Optional
from datetime import datetime

def get_todos(db: Session, skip: int = 0, limit: int = 100) -> List[models.Todo]:
    """Récupérer tous les todos avec pagination"""
    return db.query(models.Todo).order_by(desc(models.Todo.created_at)).offset(skip).limit(limit).all()

def get_todo(db: Session, todo_id: int) -> Optional[models.Todo]:
    """Récupérer un todo par son ID"""
    return db.query(models.Todo).filter(models.Todo.id == todo_id).first()

def create_todo(db: Session, todo: schemas.TodoCreate) -> models.Todo:
    """Créer un nouveau todo"""
    db_todo = models.Todo(**todo.model_dump())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def update_todo(db: Session, todo_id: int, todo: schemas.TodoUpdate) -> Optional[models.Todo]:
    """Mettre à jour un todo existant"""
    db_todo = get_todo(db, todo_id)
    if not db_todo:
        return None
    
    update_data = todo.model_dump(exclude_unset=True)
    if update_data:
        for key, value in update_data.items():
            setattr(db_todo, key, value)
        db_todo.version += 1
        db_todo.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_todo)
    return db_todo

def update_todo_edit_state(db: Session, todo_id: int, edit: schemas.TodoEdit) -> Optional[models.Todo]:
    """Mettre à jour l'état d'édition d'un todo"""
    db_todo = get_todo(db, todo_id)
    if not db_todo:
        return None
    
    db_todo.is_editing = edit.is_editing
    db_todo.last_modified_by = edit.last_modified_by
    db_todo.updated_at = datetime.utcnow()
    
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

def get_todos(db: Session, completed: bool = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Todo)
    if completed is not None:
        query = query.filter(models.Todo.completed == completed)
    return query.offset(skip).limit(limit).all()

def get_todo_stats(db: Session):
    total_todos = db.query(models.Todo).count()
    completed_todos = db.query(models.Todo).filter(models.Todo.completed == True).count()
    pending_todos = total_todos - completed_todos
    
    return {
        "total": total_todos,
        "completed": completed_todos,
        "pending": pending_todos,
        "completion_rate": round((completed_todos / total_todos * 100) if total_todos > 0 else 0, 2)
    }