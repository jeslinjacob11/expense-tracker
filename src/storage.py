import json
from pathlib import Path

DATA_FILE = Path("data/expenses.json")


def load_expenses():
    """Read all expenses from the JSON file."""
    with open(DATA_FILE, "r") as file:
        return json.load(file)


def save_expenses(expenses):
    """Write all expenses to the JSON file."""
    with open(DATA_FILE, "w") as file:
        json.dump(expenses, file, indent=4)