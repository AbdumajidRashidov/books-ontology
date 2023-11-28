from django.contrib import admin
from django.urls import path
from app.books import views

# urlpatterns = [
#     path('admin/', admin.site.urls),
# ]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('books/', views.get_books, name='get_books'),
    path('quotes/', views.get_quotes, name='get_quotes'),
    path('genres/', views.get_genres, name='get_genres'),
    path('books-search/', views.get_books_by_search, name='get_books_by_search'),
    path('books-nlp/', views.get_books_with_NLP, name='get_books_with_NLP'),
    path('books-genre/', views.get_books_by_genre, name='get_books_by_genre'),
    path('books/<int:book_id>/', views.get_book_details, name='book_details'),
    path('', views.get_home, name='get_home'),
]
