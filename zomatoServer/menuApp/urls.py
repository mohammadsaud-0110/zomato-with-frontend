from django.urls import path
from menuApp import views

urlpatterns = [
    path('', views.default_path, name='default_path'),
    path('menu/', views.menu_list, name='menu_list'),
    path('dish/add', views.add_dish, name='add_dish'),
    path('dish/remove', views.remove_dish, name='remove_dish'),   #query
    path('dish/update', views.update_dish, name='update_dish'),   #query
    path('order/', views.order_list, name='order_list'),
    path('order/takeorder', views.take_order, name='take_order'),
    path('order/update', views.update_order_status, name='update_order_status'),  #query
]