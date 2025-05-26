from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models
from ..database import get_db

router = APIRouter()

@router.get("/summary")
def get_todos_stats(db: Session = Depends(get_db)):
    """Obtenir des statistiques sur les todos"""
    total_todos = db.query(models.Todo).count()
    completed_todos = db.query(models.Todo).filter(models.Todo.completed == True).count()
    pending_todos = total_todos - completed_todos
    
    return {
        "total": total_todos,
        "completed": completed_todos,
        "pending": pending_todos,
        "completion_rate": round((completed_todos / total_todos * 100) if total_todos > 0 else 0, 2)
    } 