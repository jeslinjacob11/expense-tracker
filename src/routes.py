from fastapi import APIRouter, HTTPException

from src.models import ExpenseCreate
from src.services import (
    add_expense,
    get_all_expenses,
    get_expenses_by_category,
    get_total_expenses,
    get_total_by_category,
    delete_expense,
)

router = APIRouter()


@router.post("/expenses", status_code=201)
def create_expense(expense: ExpenseCreate):
    return add_expense(expense)


@router.get("/expenses")
def view_expenses():
    return get_all_expenses()


@router.get("/expenses/category/{category}")
def filter_by_category(category: str):
    return get_expenses_by_category(category)


@router.get("/expenses/total")
def total_expenses():
    return get_total_expenses()


@router.get("/expenses/total/{category}")
def total_by_category(category: str):
    return get_total_by_category(category)


@router.delete("/expenses/{expense_id}")
def remove_expense(expense_id: int):
    result = delete_expense(expense_id)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    return result