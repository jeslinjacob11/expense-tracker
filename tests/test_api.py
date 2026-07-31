from fastapi.testclient import TestClient

from src.main import app

client = TestClient(app)


def test_home():
    response = client.get("/")

    assert response.status_code == 200


def test_add_expense():

    expense = {

        "title": "Pizza",

        "amount": 450,

        "category": "Food",

        "date": "2026-08-01"

    }

    response = client.post("/expenses", json=expense)

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == "Pizza"

    assert data["amount"] == 450

    assert data["category"] == "Food"


def test_get_all_expenses():

    response = client.get("/expenses")

    assert response.status_code == 200

    assert isinstance(response.json(), list)


def test_filter_category():

    response = client.get("/expenses/category/Food")

    assert response.status_code == 200

    assert isinstance(response.json(), list)


def test_total_expenses():

    response = client.get("/expenses/total")

    assert response.status_code == 200

    assert "total" in response.json()


def test_total_by_category():

    response = client.get("/expenses/total/Food")

    assert response.status_code == 200

    assert "total" in response.json()


def test_delete_invalid_expense():

    response = client.delete("/expenses/999999")

    assert response.status_code == 404