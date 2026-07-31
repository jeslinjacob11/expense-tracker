from pydantic import BaseModel, Field
from datetime import date


class ExpenseCreate(BaseModel):
    title: str = Field(..., min_length=1)
    amount: float = Field(..., gt=0)
    category: str = Field(..., min_length=1)
    date: date


class Expense(ExpenseCreate):
    id: int