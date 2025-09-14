const foodData = [
            { id: 1, name: "Amazing Pizza", price: 30, image: "images/image1.jpg", desc: "A classic pizza with pepperoni, olives, and fresh tomatoes.", category: "best-seller" },
            { id: 2, name: "Gulab Jamun", price: 50, image: "images/image2.webp", desc: "Soft, melt-in-your-mouth milk-solids based dessert.", category: "promotion" },
            { id: 3, name: "Masala Dosa", price: 30, image: "images/image3.jpeg", desc: "A thin, crispy dosa filled with a spiced potato mix.", category: "best-seller" },
            { id: 4, name: "Paneer Butter Masala", price: 30, image: "images/image4.jpeg", desc: "A creamy and rich paneer curry cooked in a buttery gravy.", category: "near-me" },
            { id: 5, name: "Litti Chokha", price: 30, image: "images/image5.jpeg", desc: "A traditional Bihari dish with roasted dough balls.", category: "top-rated" },
            { id: 6, name: "Chocolate ice cream", price: 30, image: "images/image6.jpeg", desc: "Rich and creamy chocolate ice cream topped with choco chips.", category: "promotion" },
            { id: 7, name: "Momos", price: 30, image: "images/image7.jpeg", desc: "Steamed or fried dumplings with a spicy dipping sauce.", category: "best-seller" },
            { id: 8, name: "Chicken Biryani", price: 30, image: "images/image8.jpeg", desc: "A flavourful mix of spiced chicken and basmati rice.", category: "top-rated" },
        ];

        let cart = [];
        let favorites = [];

        function renderFoodCards(filteredData) {
            const dashboardContent = document.querySelector('.dashboard-content');
            dashboardContent.innerHTML = '';
            const dataToRender = filteredData || foodData;

            if (dataToRender.length === 0) {
                dashboardContent.innerHTML = '<p style="text-align: center; color: var(--darkGrey); font-size: 1.2rem;">Koi item nahi mila.</p>';
                return;
            }

            dataToRender.forEach(food => {
                const isFavorite = favorites.includes(food.id);
                const card = document.createElement('div');
                card.classList.add('dashboard-card');
                card.innerHTML = `
                    <img class="card-image" src="${food.image}" alt="${food.name}">
                    <div class="card-detail">
                        <h4>${food.name} <span>$${food.price}</span></h4>
                        <p>${food.desc}</p>
                        <p class="card-time"><span class="fas fa-clock"></span>15-30 mins</p>
                        <div class="card-actions">
                            <button class="add-to-cart-btn" data-id="${food.id}">Add to Cart</button>
                            <button class="quick-view-btn" data-id="${food.id}">Quick View</button>
                        </div>
                    </div>
                    <span class="fav-icon fas fa-heart ${isFavorite ? 'active' : ''}" data-id="${food.id}"></span>
                `;
                dashboardContent.appendChild(card);
            });
        }

        function renderCartItems() {
            const cartItemsContainer = document.getElementById('cart-items');
            cartItemsContainer.innerHTML = '';
            let subtotal = 0;

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--darkGrey);">Your cart is empty.</p>';
            }

            cart.forEach(item => {
                const food = foodData.find(f => f.id === item.id);
                if (food) {
                    const totalItemPrice = food.price * item.quantity;
                    subtotal += totalItemPrice;
                    const cartCard = document.createElement('div');
                    cartCard.classList.add('order-card');
                    cartCard.innerHTML = `
                        <img class="order-image" src="${food.image}" alt="${food.name}">
                        <div class="order-detail">
                            <p>${food.name}</p>
                            <div class="quantity-control">
                                <button class="quantity-minus" data-id="${food.id}">-</button>
                                <input type="number" value="${item.quantity}" min="1" readonly>
                                <button class="quantity-plus" data-id="${food.id}">+</button>
                            </div>
                        </div>
                        <h4 class="order-price">$${totalItemPrice.toFixed(2)}</h4>
                    `;
                    cartItemsContainer.appendChild(cartCard);
                }
            });

            const deliveryFee = subtotal > 0 ? 30 : 0;
            const tax = subtotal * 0.10;
            const total = subtotal + tax + deliveryFee;

            document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
            document.getElementById('delivery-fee').textContent = `$${deliveryFee.toFixed(2)}`;
            document.getElementById('total').textContent = `$${total.toFixed(2)}`;
        }

        function handleAddToCart(event) {
            if (event.target.classList.contains('add-to-cart-btn')) {
                const foodId = parseInt(event.target.dataset.id);
                const existingItem = cart.find(item => item.id === foodId);

                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ id: foodId, quantity: 1 });
                }
                renderCartItems();
            }
        }

        function handleQuantityChange(event) {
            const target = event.target;
            if (target.classList.contains('quantity-plus') || target.classList.contains('quantity-minus')) {
                const foodId = parseInt(target.dataset.id);
                const item = cart.find(i => i.id === foodId);
                if (item) {
                    if (target.classList.contains('quantity-plus')) {
                        item.quantity += 1;
                    } else if (target.classList.contains('quantity-minus')) {
                        item.quantity -= 1;
                        if (item.quantity <= 0) {
                            cart = cart.filter(i => i.id !== foodId);
                        }
                    }
                    renderCartItems();
                }
            }
        }

        function handleFavorites(event) {
            if (event.target.classList.contains('fav-icon')) {
                const foodId = parseInt(event.target.dataset.id);
                const index = favorites.indexOf(foodId);
                if (index > -1) {
                    favorites.splice(index, 1);
                    event.target.classList.remove('active');
                } else {
                    favorites.push(foodId);
                    event.target.classList.add('active');
                }
            }
        }

        function handleCategoryFilter(event) {
            event.preventDefault();
            const category = event.target.dataset.category;
            let filteredItems = [];

            if (category === 'all' || category === 'home') {
                filteredItems = foodData;
            } else if (category === 'favs') {
                filteredItems = foodData.filter(food => favorites.includes(food.id));
            } else if (category === 'search') {
                // Search bar functionality
                const searchTerm = prompt('Search for a food item:');
                if (searchTerm) {
                    filteredItems = foodData.filter(food => food.name.toLowerCase().includes(searchTerm.toLowerCase()));
                } else {
                    return;
                }
            }
            else {
                filteredItems = foodData.filter(food => food.category === category);
            }
            renderFoodCards(filteredItems);
        }

        function showQuickViewModal(foodId) {
            const food = foodData.find(f => f.id === foodId);
            if (food) {
                const modalDetails = document.getElementById('modal-details');
                modalDetails.innerHTML = `
                    <div class="modal-food-details">
                        <img src="${food.image}" alt="${food.name}" class="modal-image">
                        <div class="modal-info">
                            <h2>${food.name}</h2>
                            <p class="modal-price">$${food.price}</p>
                            <p class="modal-desc">${food.desc}</p>
                            <button class="add-to-cart-btn" data-id="${food.id}">Add to Cart</button>
                        </div>
                    </div>
                `;
                document.getElementById('quick-view-modal').style.display = 'block';
            }
        }

        function handleQuickView(event) {
            if (event.target.classList.contains('quick-view-btn')) {
                const foodId = parseInt(event.target.dataset.id);
                showQuickViewModal(foodId);
            }
        }

        function showOrderConfirmationModal() {
            if (cart.length === 0) {
                alert('Aapka cart khali hai. Kripya pehle kuch items add karein.');
                return;
            }

            const confirmationDetails = document.getElementById('confirmation-details');
            let confirmationHTML = `
                <div class="confirmation-items-list">
                    ${cart.map(item => {
                const food = foodData.find(f => f.id === item.id);
                return `
                            <p>${food.name} x ${item.quantity} <span>$${(food.price * item.quantity).toFixed(2)}</span></p>
                        `;
            }).join('')}
                </div>
                <hr>
                <p>Subtotal: <span id="summary-subtotal">${document.getElementById('subtotal').textContent}</span></p>
                <p>Tax: <span id="summary-tax">${document.getElementById('tax').textContent}</span></p>
                <p>Delivery Fee: <span id="summary-delivery-fee">${document.getElementById('delivery-fee').textContent}</span></p>
                <hr>
                <p class="total-summary">Total: <span id="summary-total">${document.getElementById('total').textContent}</span></p>
                <p class="delivery-address">Address: 221 B Baker Street, London</p>
            `;
            confirmationDetails.innerHTML = confirmationHTML;
            document.getElementById('confirmation-modal').style.display = 'block';
        }

        function confirmOrder() {
            alert('Aapka order successful ho gaya hai! Jald hi aapke paas pahunch jaayega.');
            cart = [];
            renderCartItems();
            document.getElementById('confirmation-modal').style.display = 'none';
            document.getElementById('cart').checked = false;
        }

        document.addEventListener('DOMContentLoaded', () => {
            renderFoodCards();
            renderCartItems();
            document.querySelector('.dashboard-content').addEventListener('click', (e) => {
                handleAddToCart(e);
                handleQuickView(e);
                handleFavorites(e);
            });
            document.getElementById('cart-items').addEventListener('click', handleQuantityChange);
            document.getElementById('checkout-btn').addEventListener('click', showOrderConfirmationModal);
            document.getElementById('confirm-order-btn').addEventListener('click', confirmOrder);

            document.querySelectorAll('.dashboard-menu a').forEach(link => {
                link.addEventListener('click', handleCategoryFilter);
            });

            document.querySelectorAll('.sidebar-menu').forEach(menu => {
                menu.addEventListener('click', handleCategoryFilter);
            });


            document.querySelector('#quick-view-modal .close-btn').addEventListener('click', () => {
                document.getElementById('quick-view-modal').style.display = 'none';
            });

            document.querySelector('#confirmation-modal .close-btn-confirm').addEventListener('click', () => {
                document.getElementById('confirmation-modal').style.display = 'none';
            });
        });