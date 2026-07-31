from src.storage import load_expenses, save_expenses


def add_expense(expense):
    expenses = load_expenses()

    new_id = 1
    if expenses:
        new_id = max(item["id"] for item in expenses) + 1

    new_expense = {
        "id": new_id,
        "title": expense.title,
        "amount": expense.amount,
        "category": expense.category,
        "date": expense.date.isoformat()
    }

    expenses.append(new_expense)
    save_expenses(expenses)

    return new_expense


def get_all_expenses():
    return load_expenses()


def get_expenses_by_category(category):
    expenses = load_expenses()

    return [
        expense
        for expense in expenses
        if expense["category"].lower() == category.lower()
    ]


def get_total_expenses():
    expenses = load_expenses()

    total = sum(expense["amount"] for expense in expenses)

    return {"total": total}


def get_total_by_category(category):
    expenses = load_expenses()

    total = sum(
        expense["amount"]
        for expense in expenses
        if expense["category"].lower() == category.lower()
    )

    return {
        "category": category,
        "total": total
    }


def delete_expense(expense_id):
    expenses = load_expenses()

    updated_expenses = [
        expense
        for expense in expenses
        if expense["id"] != expense_id
    ]

    if len(updated_expenses) == len(expenses):
        return None

    save_expenses(updated_expenses)

    return {"message": "Expense deleted successfully"}