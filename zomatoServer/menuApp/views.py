from django.shortcuts import render,redirect
import json
from django.http import Http404, JsonResponse


#default route
def default_path(request):
    return render(request, 'home.html')

# view menu
def menu_list(request):
    with open('menu.json') as menu_file:
        menu_data = json.load(menu_file)
    
    return JsonResponse({'menu': menu_data})

# add new dish
def add_dish(request):
    if request.method == "POST":
        try:
            with open('menu.json', 'r') as menu_file:
                menu_data = json.load(menu_file)
        except FileNotFoundError:
            menu_data = []
        
        # Load JSON data from the request body
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        
        dishId = (menu_data[-1]['dishId'] if menu_data else 0) + 1
        dishName = data.get('dishName')
        dishPrice = data.get('dishPrice')
        dishAvailability = data.get('dishAvailability')

        dishAvailability = dishAvailability.lower()

        if dishAvailability in ["y", "yes", "ye", "ya", "yeah"]:
            dishAvailability = "yes"
        else:
            dishAvailability = "no"

        newDish = {
            'dishId': dishId,
            'dishName': dishName,
            'dishPrice': float(dishPrice),
            'dishAvailability': dishAvailability
        }

        menu_data.append(newDish)
        with open('menu.json', 'w') as menu_file:
            json.dump(menu_data, menu_file, indent=4)

        return JsonResponse({'msg': 'Dish Added to Menu', 'menu': menu_data})
    else:
        return JsonResponse({'msg': 'Wrong request made'}, status=400)

# delete dish by ID
def remove_dish(request):
    dishId = int(request.GET.get('dishId'))

    try:
        with open('menu.json', 'r') as menu_file:
            menu_data = json.load(menu_file)
    except FileNotFoundError:
        return JsonResponse({'error': 'Menu file not found'}, status=404)
    
    removed_dish = None
    new_menu_data = []

    for dish in menu_data:
        if dish['dishId'] == dishId:
            removed_dish = dish
        else:
            new_menu_data.append(dish)
    
    if removed_dish is None:
        return JsonResponse({'error': 'Dish not found'}, status=404)
    
    with open('menu.json', 'w') as menu_file:
        json.dump(new_menu_data, menu_file, indent=4)
    
    return JsonResponse({'message': f'Dish {removed_dish} removed!'})

# update dish by ID
def update_dish(request):
    # Get the dishId from the request's GET parameters
    dishId = int(request.GET.get('dishId'))
    
    try:
        # Load the menu data from the JSON file
        with open('menu.json', 'r') as menu_file:
            menu_data = json.load(menu_file)
    except FileNotFoundError:
        # Return an error response if the menu file is not found
        return JsonResponse({'error': 'Menu file not found'}, status=404)

    updated_dish = None

    # Find the dish with the specified dishId and update its availability
    for dish in menu_data:
        if dish['dishId'] == dishId:
            dish['dishAvailability'] = "no" if dish['dishAvailability'] == "yes" else "yes"
            updated_dish = dish
            break
    
    if updated_dish is None:
        # Return an error response if the specified dishId is not found
        return JsonResponse({'error': 'Dish not found'}, status=404)
    
    # Write the updated menu data back to the JSON file
    with open('menu.json', 'w') as menu_file:
        json.dump(menu_data, menu_file, indent=4)
    
    # Return a success response
    return JsonResponse({'msg': f'Dish {updated_dish} Updated'})


# all orders
def order_list(request):
    with open('order.json') as order_file:
        order_data = json.load(order_file)
    
    return JsonResponse({'order_data': order_data})

# take new order
def take_order(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Parse JSON data from the request body
            customer_name = data.get('customerName')
            dish_ids = data.get('dishIds')
            
            # Check if dishes are available
            with open('menu.json') as menu_file:
                menu_data = json.load(menu_file)
            
            unavailable_dishes = [dish for dish in menu_data if dish['dishId'] in dish_ids and dish['dishAvailability'] == 'no']
            
            if unavailable_dishes:
                return JsonResponse({'error': 'The following dishes are unavailable', 'unavailable_dishes': unavailable_dishes}, status=400)
            
            # Process the order
            try:
                with open('order.json') as order_file:
                    order_data = json.load(order_file)
            except FileNotFoundError:
                order_data = []
            
            ordered_dishes = []
            order_total_price = 0
            for item in menu_data:
                if item['dishId'] in dish_ids:
                    ordered_dishes.append({
                        'dishId': item['dishId'],
                        'dishName': item['dishName'],
                        'dishPrice': item['dishPrice']
                    })
                    order_total_price += item['dishPrice']
            
            order_id = len(order_data) + 1
            new_order = {
                'orderId': order_id,
                'customerName': customer_name,
                'orderedDishes': ordered_dishes,
                'orderPrice': order_total_price,
                'status': 'received'
            }
            order_data.append(new_order)
            
            with open('order.json', 'w') as order_file:
                json.dump(order_data, order_file, indent=4)
            
            return JsonResponse({'msg' : 'Order made successfully'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    else:
        return JsonResponse({'error': 'Wrong request made'}, status=400)

# update order status by ID
def update_order_status(request):
    if request.method == 'GET':
        order_id = int(request.GET.get('orderId'));
        new_status = request.GET.get('newStatus')
        
        with open('order.json') as order_file:
            order_data = json.load(order_file)
        
        order_found = False
        for order in order_data:
            if order['orderId'] == order_id:
                order['status'] = new_status
                order_found = True
                break
        
        if not order_found:
            return JsonResponse({'error': 'Order not found'}, status=404)
        
        with open('order.json', 'w') as order_file:
            json.dump(order_data, order_file, indent=4)
        
        return JsonResponse({'msg': 'Order status updated successfully'})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


