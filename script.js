// Toggle Admin Section
function toggleAdmin(show) {
    const adminSection = document.getElementById('admin');
    const customerSections = document.querySelectorAll('section:not(#admin)');
    if (show) {
        adminSection.style.display = 'flex';
        customerSections.forEach(section => section.style.display = 'none');
    } else {
        adminSection.style.display = 'none';
        customerSections.forEach(section => section.style.display = 'block');
    }
}

// Add admin toggle to navbar
document.querySelector('.nav-links').innerHTML += `
<a href="#" onclick="showAdminLogin(event)">Admin Dashboard</a>
`;

// Sidebar Navigation
const sidebarLinks = document.querySelectorAll('.sidebar-nav a:not(.logout)');
sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        sidebarLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const sectionId = link.getAttribute('href').replace('#', '');
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(`${sectionId}-section`).classList.add('active');
    });
});

// Chart.js Analytics
const ctx = document.getElementById('ordersChart').getContext('2d');
const ordersChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Orders',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: 'var(--primary-color)',
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(255, 107, 107, 0.2)'
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true }
        }
    }
});

// Example Edit/Delete Actions
document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => alert('Edit functionality to be implemented'));
});
document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (confirm('Are you sure?')) {
            btn.closest('tr').remove();
        }
    });
});
// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Cart Functionality
const cartBtn = document.querySelector('.cart-btn');
const cartBadge = document.querySelector('.cart-badge');
const cartModal = document.querySelector('.cart-modal');
const overlay = document.querySelector('.overlay');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const totalAmount = document.querySelector('.total-amount');

let cart = [];

// Open/Close Cart
cartBtn.addEventListener('click', () => {
    cartModal.classList.add('active');
    overlay.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartModal.classList.remove('active');
    overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
    cartModal.classList.remove('active');
    overlay.classList.remove('active');
});

// Add to Cart Functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const menuItem = button.closest('.menu-item');
        const itemName = menuItem.querySelector('h3').textContent;
        const itemPrice = parseFloat(menuItem.querySelector('.item-price').textContent.replace('₹', ''));
        const itemImage = menuItem.querySelector('.item-image').src;

        const existingItem = cart.find(item => item.name === itemName);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: itemName,
                price: itemPrice,
                image: itemImage,
                quantity: 1
            });
        }

        updateCart();

        // Add success animation to button
        button.style.animation = 'addToCartSuccess 0.5s ease';
        setTimeout(() => button.style.animation = '', 500);

        // Create flying dot animation
        const dot = document.createElement('div');
        dot.className = 'cart-animation';
        const rect = button.getBoundingClientRect();
        const cartRect = document.querySelector('.cart-btn').getBoundingClientRect();

        dot.style.left = `${rect.left + rect.width / 2}px`;
        dot.style.top = `${rect.top + rect.height / 2}px`;

        document.body.appendChild(dot);

        // Calculate the path to cart
        const dx = cartRect.left + cartRect.width / 2 - (rect.left + rect.width / 2);
        const dy = cartRect.top + cartRect.height / 2 - (rect.top + rect.height / 2);

        dot.style.setProperty('--dx', `${dx}px`);
        dot.style.setProperty('--dy', `${dy}px`);

        setTimeout(() => dot.remove(), 600);
    });
});

function updateCart() {
    cartItems.innerHTML = '';
    let subtotal = 0;
    const TAX_RATE = 0.05; // 5% tax rate
    const emptyCart = document.querySelector('.cart-empty');
    const cartTotal = document.querySelector('.cart-total');
    const checkoutBtn = document.querySelector('.checkout-btn');

    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartTotal.style.display = 'none';
        checkoutBtn.style.display = 'none';
    } else {
        emptyCart.style.display = 'none';
        cartTotal.style.display = 'block';
        checkoutBtn.style.display = 'block';

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.style.animationDelay = `${index * 0.1}s`;
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-quantity-controls">
                        <button class="cart-quantity-btn" onclick="updateItemQuantity('${item.name}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="cart-quantity-btn" onclick="updateItemQuantity('${item.name}', ${item.quantity + 1})">+</button>
                    </div>
                    <div class="cart-item-price">
                        <span class="unit-price">₹${item.price.toFixed(2)} each</span>
                        <span class="total-price">₹${itemTotal.toFixed(2)}</span>
                    </div>
                </div>
                <i class="fas fa-trash remove-item" onclick="removeItem('${item.name}')" style="cursor: pointer;"></i>
            `;
            cartItems.appendChild(cartItem);
        });

        const taxes = subtotal * TAX_RATE;
        const total = subtotal + taxes;

        // Update cart totals
        cartTotal.innerHTML = `
            <div class="cart-subtotal">
                <span>Subtotal:</span>
                <span>₹${subtotal.toFixed(2)}</span>
            </div>
            <div class="cart-taxes">
                <span>Taxes (5%):</span>
                <span>₹${taxes.toFixed(2)}</span>
            </div>
            <h3>Total: ₹${total.toFixed(2)}</h3>
        `;

        totalAmount.textContent = total.toFixed(2);
    }

    // Update cart badge
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = itemCount;
    cartCount.style.display = itemCount > 0 ? 'flex' : 'none';

    // Animate cart button
    cartBtn.style.animation = 'cartBounce 0.5s ease';
    setTimeout(() => cartBtn.style.animation = '', 500);
}

// Add this new function for updating item quantities
function updateItemQuantity(itemName, newQuantity) {
    const item = cart.find(item => item.name === itemName);
    if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            removeItem(itemName);
            return;
        }
    }
    updateCart();
}

// Update removeItem function
function removeItem(itemName) {
    const index = cart.findIndex(item => item.name === itemName);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCart();
    }
}

// Enhanced cart button interaction
cartBtn.addEventListener('mouseenter', () => {
    cartBtn.style.transform = 'translateY(-5px) scale(1.05)';
});

cartBtn.addEventListener('mouseleave', () => {
    cartBtn.style.transform = 'translateY(0) scale(1)';
});

// Menu Filter Functionality
const menuItems = document.querySelectorAll('.menu-item');
const categoryLinks = document.querySelectorAll('.dish-nav a');

categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.getAttribute('href').replace('#', '');

        // Update active state
        categoryLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Filter items
        menuItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
                // Reset animation
                item.style.animation = 'none';
                item.offsetHeight; // Trigger reflow
                item.style.animation = null;
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Login Modal Functionality
const loginModal = document.querySelector('.login-modal');
const closeLogin = document.querySelector('.close-login');
const orderNowBtn = document.querySelector('.hero-content .primary-btn');

orderNowBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.add('active');
    overlay.classList.add('active');
});

closeLogin.addEventListener('click', () => {
    loginModal.classList.remove('active');
    overlay.classList.remove('active');
});

// Close modal on overlay click
overlay.addEventListener('click', () => {
    loginModal.classList.remove('active');
    overlay.classList.remove('active');
});

// Form submission
const loginForm = document.querySelector('.login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Add your login logic here
    console.log('Login attempted:', { email, password });

    // For demo: Close modal and scroll to menu
    loginModal.classList.remove('active');
    overlay.classList.remove('active');
    document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
});

// Signup Modal Functionality
const signupModal = document.querySelector('.signup-modal');
const closeSignup = document.querySelector('.close-signup');
const switchToSignup = document.querySelector('.switch-to-signup');
const switchToLogin = document.querySelector('.switch-to-login');
const signupForm = document.querySelector('.signup-form');

// Switch between login and signup
switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.remove('active');
    signupModal.classList.add('active');
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.classList.remove('active');
    loginModal.classList.add('active');
});

closeSignup.addEventListener('click', () => {
    signupModal.classList.remove('active');
    overlay.classList.remove('active');
});

// Signup form validation and submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Reset previous errors
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
        const existingError = group.querySelector('.error-message');
        if (existingError) existingError.remove();
    });

    // Validate
    let isValid = true;

    if (password !== confirmPassword) {
        showError('confirm-password', 'Passwords do not match');
        isValid = false;
    }

    if (password.length < 8) {
        showError('signup-password', 'Password must be at least 8 characters');
        isValid = false;
    }

    if (isValid) {
        // Store user data (you would typically send this to a server)
        const userData = {
            name,
            email,
            password
        };
        localStorage.setItem('user', JSON.stringify(userData));

        // Show success and redirect to menu
        signupModal.classList.remove('active');
        overlay.classList.remove('active');
        document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
    }
});

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
}

// Close modals on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        loginModal.classList.remove('active');
        signupModal.classList.remove('active');
        cartModal.classList.remove('active');
        overlay.classList.remove('active');
    }
});

// 3D Navbar Animation
const initNavbar3D = () => {
    const canvas = document.getElementById('navbar-canvas');
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 80, 0.1, 1000);

    // Set renderer size
    const updateSize = () => {
        renderer.setSize(window.innerWidth, 80);
        camera.aspect = window.innerWidth / 80;
        camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', updateSize);
    updateSize();

    // Create particles
    const particles = new THREE.BufferGeometry();
    const particleCount = 100;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Create particle material
    const material = new THREE.PointsMaterial({
        size: 0.005,
        color: '#ff6b6b',
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    // Create particle system
    const particleSystem = new THREE.Points(particles, material);
    scene.add(particleSystem);

    camera.position.z = 1;

    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);

        particleSystem.rotation.x += 0.0001;
        particleSystem.rotation.y += 0.0001;

        // Smooth camera movement based on mouse position
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    };

    animate();
};

// Initialize 3D navbar when document is loaded
document.addEventListener('DOMContentLoaded', initNavbar3D);

// Logo 3D effect
const logo = document.querySelector('.logo');
logo.addEventListener('mousemove', (e) => {
    const rect = logo.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    logo.style.transform = `
        perspective(1000px)
        rotateX(${y * 20}deg)
        rotateY(${x * 20}deg)
        translateZ(20px)
    `;
});

logo.addEventListener('mouseleave', () => {
    logo.style.transform = 'none';
});

// Enhanced category interaction
const categoryItems = document.querySelectorAll('.category-item');

categoryItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        item.style.transform = `
            translateZ(20px)
            rotateX(${y * 10}deg)
            rotateY(${x * 10}deg)
        `;
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = item.classList.contains('active')
            ? 'translateZ(30px)'
            : 'translateZ(0)';
    });

    item.addEventListener('click', (e) => {
        e.preventDefault();
        categoryItems.forEach(cat => {
            cat.classList.remove('active');
            cat.style.transform = 'translateZ(0)';
        });
        item.classList.add('active');
        item.style.transform = 'translateZ(30px)';

        // ... existing category filtering logic ...
    });
});

// Add this after existing navbar script
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');

    // Add stagger animation to nav items
    navLinks.forEach((link, index) => {
        link.style.animation = `navItemFloat 3s ease-in-out ${index * 0.2}s infinite`;
    });

    // Add hover effect with ripple
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            // Remove this incorrect block
            // 50% { transform: translateY(-5px); }
            // 100% { transform: translateY(0); }
        });
    });
});

// Payment step handling
let currentStep = 1;
const totalSteps = 3;

function updatePaymentStep() {
    // Update progress bar
    document.querySelector('.progress-line-fill').style.width =
        `${((currentStep - 1) / (totalSteps - 1)) * 100}%`;

    // Update step indicators
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.toggle('active', index + 1 <= currentStep);
    });

    // Show/hide steps
    document.querySelectorAll('.payment-step').forEach((step, index) => {
        step.classList.toggle('active', index + 1 === currentStep);
    });

    // Update buttons
    document.getElementById('prevStep').style.display = currentStep > 1 ? 'block' : 'none';
    document.getElementById('nextStep').textContent =
        currentStep === totalSteps ? 'Pay Now' : 'Continue';
}

// Navigation handlers
document.getElementById('nextStep').addEventListener('click', () => {
    if (currentStep < totalSteps) {
        currentStep++;
        updatePaymentStep();
    } else {
        processPayment();
    }
});

document.getElementById('prevStep').addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updatePaymentStep();
    }
});

function processPayment() {
    // Show loading state
    const payBtn = document.getElementById('nextStep');
    payBtn.disabled = true;
    payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    // Create new order
    const order = {
        id: `ORD${Date.now()}`,
        items: cart.map(item => ({...item})),
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'Pending',
        date: new Date().toISOString(),
        customer: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : 'Guest'
    };

    // Simulate payment processing
    setTimeout(() => {
        // Add order to orders array
        orders.push(order);
        updateOrdersTable();
        updateOrderStats(); // Add this line

        // Update inventory
        order.items.forEach(item => {
            const inventoryItem = inventoryItems.find(i => i.name === item.name);
            if (inventoryItem) {
                inventoryItem.stock -= item.quantity;
            }
        });
        updateInventoryStats();
        updateInventoryTable();

        // Show success animation
        document.querySelector('.payment-steps').innerHTML = `
            <div class="success-checkmark">
                <div class="check-icon">
                    <span class="icon-line line-tip"></span>
                    <span class="icon-line line-long"></span>
                </div>
            </div>
            <h3 style="text-align: center; margin-top: 2rem;">Payment Successful!</h3>
            <p style="text-align: center;">Your order #${order.id} is being processed.</p>
        `;

        // Clear cart
        cart = [];
        updateCart();

        // Close modal after delay
        setTimeout(() => {
            document.querySelector('.payment-modal').classList.remove('active');
            overlay.classList.remove('active');
        }, 2000);
    }, 2000);
}

// Add function to update orders table in admin panel
function updateOrdersTable() {
    const tbody = document.querySelector('#orders-section table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    orders.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>₹${order.total.toFixed(2)}</td>
            <td>
                <select onchange="updateOrderStatus('${order.id}', this.value)" class="status-select ${order.status.toLowerCase()}">
                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>${new Date(order.date).toLocaleString()}</td>
            <td>
                <button class="view-btn" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Function to update order status
function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        updateOrdersTable();
        updateOrderStats();
    }
}

// Function to view order details
function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.createElement('div');
    modal.className = 'order-details-modal';
    modal.innerHTML = `
        <div class="order-details-content">
            <h3>Order Details - ${order.id}</h3>
            <p><strong>Customer:</strong> ${order.customer}</p>
            <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <div class="order-items">
                <h4>Items</h4>
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-details">
                            <h5>${item.name}</h5>
                            <p>Quantity: ${item.quantity}</p>
                            <p>Price: ₹${item.price}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <h4>Total: ₹${order.total.toFixed(2)}</h4>
            </div>
            <button class="btn primary-btn" onclick="this.closest('.order-details-modal').remove()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Update cart function to include order summary
function updateOrderSummary() {
    const summary = document.querySelector('.order-summary');
    if (!summary) return;

    let html = '<div class="cart-items">';
    cart.forEach(item => {
        html += `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₹${item.price} × ${item.quantity}</p>
            </div>
            <div class="item-total">₹${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `;
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    html += `
    <div class="cart-summary">
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>₹${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Tax (5%):</span>
            <span>₹${tax.toFixed(2)}</span>
        </div>
        <div class="summary-row total">
            <span>Total:</span>
            <span>₹${total.toFixed(2)}</span>
        </div>
    </div>
</div>`;

    summary.innerHTML = html;
}

// Update the checkout button click handler
document.querySelector('.checkout-btn').addEventListener('click', () => {
    currentStep = 1;
    updatePaymentStep();
    updateOrderSummary();
    document.querySelector('.payment-modal').classList.add('active');
});

function selectPaymentMethod(element, method) {
    // Remove active class from all methods
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('active');
    });

    // Add active class to selected method
    element.classList.add('active');

    // Add animation to icon
    const icon = element.querySelector('i');
    icon.style.animation = 'none';
    icon.offsetHeight; // Trigger reflow
    icon.style.animation = 'spin 0.5s ease-out';

    // Store selected method
    selectedPaymentMethod = method;

    // Enable continue button
    document.getElementById('nextStep').disabled = false;
}

function updatePaymentStep() {
    const steps = document.querySelectorAll('.payment-step');
    const currentStepElement = document.querySelector(`#step${currentStep}`);

    steps.forEach(step => step.classList.remove('active'));
    currentStepElement.classList.add('active');

    // Update progress bar
    document.querySelector('.progress-line-fill').style.width =
        `${((currentStep - 1) / (totalSteps - 1)) * 100}%`;

    // Update step indicators
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
            step.style.animation = 'pulse 0.5s ease-out';
        } else {
            step.classList.remove('active');
            step.style.animation = '';
        }
    });

    // Update buttons
    document.getElementById('prevStep').style.display = currentStep > 1 ? 'block' : 'none';
    document.getElementById('nextStep').textContent = currentStep === totalSteps ? 'Pay Now' : 'Continue';
}

// Format card number input
document.getElementById('card-number')?.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    e.target.value = formattedValue.slice(0, 19);
});

// Format expiry date input
document.getElementById('expiry')?.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

// Update payment step function to handle card form
function selectPaymentMethod(element, method) {
    const step3 = document.getElementById('step3');

    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('active');
    });

    element.classList.add('active');
    element.querySelector('i').style.animation = 'spin 0.5s ease-out';

    // Show appropriate form based on payment method
    switch (method) {
        case 'card':
            step3.innerHTML = `
                <h3>Enter Card Details</h3>
                <form class="card-payment-form">
                    <div class="card-input-group">
                        <input type="text" class="card-input" id="card-number" placeholder="Card Number">
                        <i class="fas fa-credit-card card-icon"></i>
                    </div>
                    <div class="card-row">
                        <div class="card-input-group">
                            <input type="text" class="card-input" id="expiry" placeholder="MM/YY">
                            <i class="fas fa-calendar-alt card-icon"></i>
                        </div>
                        <div class="card-input-group">
                            <input type="password" class="card-input" id="cvv" placeholder="CVV">
                            <i class="fas fa-lock card-icon"></i>
                        </div>
                    </div>
                </form>
            `;
            setupCardInputListeners();
            break;

        case 'upi':
            step3.innerHTML = `
                <div class="upi-form">
                    <h3>UPI Payment</h3>
                    <div class="upi-qr-container">
                        <img src="https://example.com/qr-code.png" alt="UPI QR Code">
                    </div>
                    <p>Scan QR code using any UPI app</p>
                    <div class="payment-instructions">
                        <p>Or pay using UPI ID: foodie@upi</p>
                        <div class="wallet-options">
                            <button class="wallet-option">
                                <img src="path-to-gpay-logo.png" alt="GPay">
                                Google Pay
                            </button>
                            <button class="wallet-option">
                                <img src="path-to-phonepe-logo.png" alt="PhonePe">
                                PhonePe
                            </button>
                            <button class="wallet-option">
                                <img src="path-to-paytm-logo.png" alt="Paytm">
                                Paytm
                            </button>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'wallet':
            step3.innerHTML = `
                <h3>Digital Wallet</h3>
                <div class="wallet-options">
                    <button class="wallet-option" onclick="handleWalletSelection(this, 'gpay')">
                        <i class="fab fa-google-pay"></i>
                        Google Pay
                    </button>
                    <button class="wallet-option" onclick="handleWalletSelection(this, 'phonepe')">
                        <i class="fas fa-mobile-alt"></i>
                        PhonePe
                    </button>
                    <button class="wallet-option" onclick="handleWalletSelection(this, 'paytm')">
                        <i class="fas fa-wallet"></i>
                        Paytm
                    </button>
                </div>
            `;
            break;

        case 'netbanking':
            step3.innerHTML = `
                <h3>Net Banking</h3>
                <div class="bank-list">
                    <div class="bank-option" onclick="handleBankSelection(this, 'sbi')">
                        <img src="path-to-sbi-logo.png" alt="SBI">
                        <p>State Bank of India</p>
                    </div>
                    <div class="bank-option" onclick="handleBankSelection(this, 'hdfc')">
                        <img src="path-to-hdfc-logo.png" alt="HDFC">
                        <p>HDFC Bank</p>
                    </div>
                    <div class="bank-option" onclick="handleBankSelection(this, 'icici')">
                        <img src="path-to-icici-logo.png" alt="ICICI">
                        <p>ICICI Bank</p>
                    </div>
                    <!-- Add more banks as needed -->
                </div>
            `;
            break;
    }

    document.getElementById('nextStep').disabled = false;
}

// Handle wallet selection
function handleWalletSelection(element, wallet) {
    document.querySelectorAll('.wallet-option').forEach(el => {
        el.classList.remove('active');
    });
    element.classList.add('active');
}

// Handle bank selection
function handleBankSelection(element, bank) {
    document.querySelectorAll('.bank-option').forEach(el => {
        el.classList.remove('active');
    });
    element.classList.add('active');
}

// Enhanced payment modal navigation
document.getElementById('backToCart').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.payment-modal').classList.remove('active');
    document.querySelector('.cart-modal').classList.add('active');
});

// Close payment modal on outside click
overlay.addEventListener('click', () => {
    document.querySelector('.payment-modal').classList.remove('active');
    document.querySelector('.cart-modal').classList.add('active');
});

// Close payment modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.querySelector('.payment-modal').classList.contains('active')) {
        document.querySelector('.payment-modal').classList.remove('active');
        document.querySelector('.cart-modal').classList.add('active');
    }
});

// Add close button handler
document.querySelector('.payment-close').addEventListener('click', () => {
    document.querySelector('.payment-modal').classList.remove('active');
    document.querySelector('.cart-modal').classList.add('active');
});

function setupCardInputListeners() {
    // Re-add event listeners for card input formatting
    document.getElementById('card-number')?.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        e.target.value = formattedValue.slice(0, 19);
    });

    document.getElementById('expiry')?.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });
}

// Add tagline rotation functionality
const taglines = [
    "Delicious Food Delivered to You",
    "Experience Culinary Excellence",
    "Fresh & Hot, Right at Your Door",
    "Satisfy Your Cravings Instantly",
    "Quality Food, Quick Delivery"
];

let currentTaglineIndex = 0;
const taglineElement = document.querySelector('.hero-tagline');

function rotateTagline() {
    taglineElement.classList.add('fade-out');

    setTimeout(() => {
        currentTaglineIndex = (currentTaglineIndex + 1) % taglines.length;
        taglineElement.textContent = taglines[currentTaglineIndex];
        taglineElement.classList.remove('fade-out');
        taglineElement.classList.add('fade-in');
    }, 500);

    setTimeout(() => {
        taglineElement.classList.remove('fade-in');
    }, 1000);
}

// Start the tagline rotation
setInterval(rotateTagline, 4000);

// Add button hover animation
const orderBtn = document.querySelector('.order-now-btn');
orderBtn.addEventListener('mouseover', () => {
    orderBtn.querySelector('i').style.transform = 'translateX(5px)';
});

orderBtn.addEventListener('mouseout', () => {
    orderBtn.querySelector('i').style.transform = 'translateX(0)';
});

// Add button click effect
orderBtn.addEventListener('click', function (e) {
    let x = e.clientX - e.target.offsetLeft;
    let y = e.clientY - e.target.offsetTop;

    let ripple = document.createElement('span');
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
});

// Add these functions to your existing JavaScript
function showAdminLogin(e) {
    e.preventDefault();
    document.querySelector('.admin-login-modal').classList.add('active');
}

document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    const errorMessage = this.querySelector('.error-message');

    if(password === '0000') {
        document.querySelector('.admin-login-modal').classList.remove('active');
        toggleAdmin(true);
        document.getElementById('adminPassword').value = '';
        errorMessage.textContent = '';
    } else {
        errorMessage.textContent = 'Incorrect password';
        errorMessage.style.color = 'red';
    }
});

document.querySelector('.close-admin-login').addEventListener('click', () => {
    document.querySelector('.admin-login-modal').classList.remove('active');
});

function showAddProductForm() {
    document.querySelector('.add-product-form').style.display = 'block';
}

function hideAddProductForm() {
    document.querySelector('.add-product-form').style.display = 'none';
    document.getElementById('addProductForm').reset();
}

// Handle adding new menu items
document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const newItem = {
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        price: parseFloat(document.getElementById('itemPrice').value),
        stock: parseInt(document.getElementById('itemStock').value),
        minStock: parseInt(document.getElementById('itemMinStock').value),
        image: document.getElementById('itemImage').value,
        description: document.getElementById('itemDescription').value
    };

    const editId = this.dataset.editId;
    if (editId) {
        // Update existing item
        const index = inventoryItems.findIndex(item => item.id.toString() === editId);
        if (index !== -1) {
            inventoryItems[index] = { ...inventoryItems[index], ...newItem };
            
            // Update menu item
            const menuItem = document.querySelector(`.menu-item[data-id="${editId}"]`);
            if (menuItem) {
                const updatedMenuItem = createMenuItem(inventoryItems[index]);
                menuItem.replaceWith(updatedMenuItem);
            }
            // Save changes
            saveInventoryItems();
        }
        delete this.dataset.editId;
        this.querySelector('button[type="submit"]').textContent = 'Add Item';
    } else {
        // Add new item
        const success = addInventoryItem(newItem);
        if (!success) return; // Don't reset form if addition failed
    }

    this.reset();
    hideAddProductForm();
});

function createMenuItem(item) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.setAttribute('data-category', item.category);
    div.setAttribute('data-id', item.id);
    div.innerHTML = `
        <img src="${item.image}" class="item-image" alt="${item.name}">
        <div class="item-info">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <span class="item-price">₹${item.price}</span>
            <button class="btn add-to-cart">
                <i class="fas fa-shopping-cart"></i>
                Add to Cart
            </button>
        </div>
    `;

    // Add event listener to the Add to Cart button
    const addToCartBtn = div.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => addToCart(item));

    return div;
}

function updateProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    const menuItems = document.querySelectorAll('.menu-item');
    tbody.innerHTML = '';

    menuItems.forEach((item, index) => {
        const tr = document.createElement('tr');
        const name = item.querySelector('h3').textContent;
        const price = item.querySelector('.item-price').textContent;
        const image = item.querySelector('img').src;
        const category = item.getAttribute('data-category');

        tr.innerHTML = `
            <td><img src="${image}" alt="${name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
            <td>${name}</td>
            <td>${category}</td>
            <td>${price}</td>
            <td>
                <button class="edit-btn" onclick="editMenuItem(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteMenuItem(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteMenuItem(index) {
    if(confirm('Are you sure you want to delete this item?')) {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems[index].remove();
        updateProductsTable();
    }
}

// Update the admin toggle link in navbar
document.querySelector('.nav-links').innerHTML = document.querySelector('.nav-links').innerHTML.replace(
    `onclick="toggleAdmin(true)"`,
    `onclick="showAdminLogin(event)"`
);
// Initialize inventory items array from localStorage or empty array
let inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];

// Add this function to save inventory items
function saveInventoryItems() {
    localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
}

// Function to add new item to inventory
function addInventoryItem(item) {
    // Validate price is a number
    const price = parseFloat(item.price);
    if (isNaN(price)) {
        alert('Please enter a valid price');
        return false;
    }

    // Add to inventory array
    const newItem = {
        id: Date.now(),
        ...item,
        price: price, // Use validated price
        stock: parseInt(item.stock),
        minStock: parseInt(item.minStock)
    };
    
    // Check for duplicates
    const isDuplicate = inventoryItems.some(existingItem => 
        existingItem.name.toLowerCase() === item.name.toLowerCase()
    );

    if (isDuplicate) {
        alert('An item with this name already exists!');
        return false;
    }

    inventoryItems.push(newItem);
    
    // Save to localStorage
    saveInventoryItems();

    // Add single item to menu grid
    const menuGrid = document.querySelector('.menu-grid');
    const menuItem = createMenuItem(newItem);
    menuGrid.appendChild(menuItem);

    updateInventoryStats();
    updateInventoryTable();
    return true;
}

// Function to update inventory statistics
function updateInventoryStats() {
    document.getElementById('totalItems').textContent = inventoryItems.length;
    document.getElementById('lowStockItems').textContent = 
    inventoryItems.filter(item => item.stock <= item.minStock).length;
    document.getElementById('inventoryValue').textContent = 
    '₹' + inventoryItems.reduce((sum, item) => sum + (item.price * item.stock), 0).toFixed(2);
}

// Function to update inventory table
function updateInventoryTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    inventoryItems.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>₹${item.price}</td>
            <td>
                <input type="number" value="${item.stock}" 
                    onchange="updateStock(${item.id}, this.value)" 
                    min="0" class="stock-input">
            </td>
            <td>
                <span class="stock-status ${item.stock <= item.minStock ? 'low-stock' : 'in-stock'}">
                    ${item.stock <= item.minStock ? 'Low Stock' : 'In Stock'}
                </span>
            </td>
            <td>
                <button class="edit-btn" onclick="editItem(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Function to update stock
function updateStock(itemId, newStock) {
    const item = inventoryItems.find(item => item.id === itemId);
    if (item) {
        item.stock = parseInt(newStock);
        updateInventoryStats();
        updateInventoryTable();
        saveInventoryItems();
    }
}

// Update the addToCart function to check stock
function addToCart(menuItem) {
    const inventoryItem = inventoryItems.find(item => item.name === menuItem.name);
    if (!inventoryItem || inventoryItem.stock <= 0) {
        alert('Sorry, this item is out of stock!');
        return;
    }

    const existingItem = cart.find(item => item.name === menuItem.name);
    if (existingItem) {
        if (existingItem.quantity < inventoryItem.stock) {
            existingItem.quantity += 1;
            inventoryItem.stock -= 1;
        } else {
            alert('Sorry, no more stock available for this item!');
            return;
        }
    } else {
        cart.push({
            name: menuItem.name,
            price: menuItem.price,
            image: menuItem.image,
            quantity: 1
        });
        inventoryItem.stock -= 1;
    }

    updateCart();
    updateInventoryStats();
    updateInventoryTable();
    saveInventoryItems();
}

// Add this to store orders
let orders = [];

// Add function to update orders table in admin panel
function updateOrdersTable() {
    const tbody = document.querySelector('#orders-section table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    orders.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>₹${order.total.toFixed(2)}</td>
            <td>
                <select onchange="updateOrderStatus('${order.id}', this.value)" class="status-select ${order.status.toLowerCase()}">
                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>${new Date(order.date).toLocaleString()}</td>
            <td>
                <button class="view-btn" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Function to update order status
function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        updateOrdersTable();
        updateOrderStats();
    }
}

// Function to view order details
function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.createElement('div');
    modal.className = 'order-details-modal';
    modal.innerHTML = `
        <div class="order-details-content">
            <h3>Order Details - ${order.id}</h3>
            <p><strong>Customer:</strong> ${order.customer}</p>
            <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <div class="order-items">
                <h4>Items</h4>
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-details">
                            <h5>${item.name}</h5>
                            <p>Quantity: ${item.quantity}</p>
                            <p>Price: ₹${item.price}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <h4>Total: ₹${order.total.toFixed(2)}</h4>
            </div>
            <button class="btn primary-btn" onclick="this.closest('.order-details-modal').remove()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Update addInventoryItem function
function addInventoryItem(item) {
    // Validate price is a number
    const price = parseFloat(item.price);
    if (isNaN(price)) {
        alert('Please enter a valid price');
        return false;
    }

    // Add to inventory array
    const newItem = {
        id: Date.now(),
        ...item,
        price: price, // Use validated price
        stock: parseInt(item.stock),
        minStock: parseInt(item.minStock)
    };
    
    // Check for duplicates
    const isDuplicate = inventoryItems.some(existingItem => 
        existingItem.name.toLowerCase() === item.name.toLowerCase()
    );

    if (isDuplicate) {
        alert('An item with this name already exists!');
        return false;
    }

    inventoryItems.push(newItem);
    
    // Save to localStorage
    saveInventoryItems();

    // Add single item to menu grid
    const menuGrid = document.querySelector('.menu-grid');
    const menuItem = createMenuItem(newItem);
    menuGrid.appendChild(menuItem);

    updateInventoryStats();
    updateInventoryTable();
    return true;
}

// Update createMenuItem function
function createMenuItem(item) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.setAttribute('data-category', item.category);
    div.setAttribute('data-id', item.id);
    div.innerHTML = `
        <img src="${item.image}" class="item-image" alt="${item.name}">
        <div class="item-info">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <span class="item-price">₹${item.price}</span>
            <button class="btn add-to-cart">
                <i class="fas fa-shopping-cart"></i>
                Add to Cart
            </button>
        </div>
    `;

    // Add event listener to the Add to Cart button
    const addToCartBtn = div.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => addToCart(item));

    return div;
}

// Add editItem function
function editItem(itemId) {
    const item = inventoryItems.find(item => item.id === itemId);
    if (!item) return;

    // Show add product form with existing values
    document.querySelector('.add-product-form').style.display = 'block';
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemStock').value = item.stock;
    document.getElementById('itemMinStock').value = item.minStock;
    document.getElementById('itemImage').value = item.image;
    document.getElementById('itemDescription').value = item.description;

    // Change form submission to update instead of add
    const form = document.getElementById('addProductForm');
    form.dataset.editId = itemId;
    form.querySelector('button[type="submit"]').textContent = 'Update Item';
}

// Add deleteItem function
function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    // Remove from inventory array
    const index = inventoryItems.findIndex(item => item.id === itemId);
    if (index !== -1) {
        inventoryItems.splice(index, 1);
        // Save changes to localStorage
        saveInventoryItems();
    }

    // Remove from menu grid
    const menuItem = document.querySelector(`.menu-item[data-id="${itemId}"]`);
    if (menuItem) {
        menuItem.remove();
    }

    updateInventoryStats();
    updateInventoryTable();
}

// Update form submission handler
document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const price = parseFloat(document.getElementById('itemPrice').value);
    if (isNaN(price)) {
        alert('Please enter a valid price');
        return;
    }

    const newItem = {
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        price: price,
        stock: parseInt(document.getElementById('itemStock').value),
        minStock: parseInt(document.getElementById('itemMinStock').value),
        image: document.getElementById('itemImage').value,
        description: document.getElementById('itemDescription').value
    };

    const editId = this.dataset.editId;
    if (editId) {
        // Update existing item
        const index = inventoryItems.findIndex(item => item.id.toString() === editId);
        if (index !== -1) {
            inventoryItems[index] = { ...inventoryItems[index], ...newItem };
            
            // Update menu item
            const menuItem = document.querySelector(`.menu-item[data-id="${editId}"]`);
            if (menuItem) {
                const updatedMenuItem = createMenuItem(inventoryItems[index]);
                menuItem.replaceWith(updatedMenuItem);
            }
            // Save changes
            saveInventoryItems();
        }
        delete this.dataset.editId;
        this.querySelector('button[type="submit"]').textContent = 'Add Item';
    } else {
        // Add new item
        const success = addInventoryItem(newItem);
        if (!success) return; // Don't reset form if addition failed
    }

    this.reset();
    hideAddProductForm();
});

// Update inventory table function
function updateInventoryTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    inventoryItems.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>₹${item.price}</td>
            <td>
                <input type="number" value="${item.stock}" 
                    onchange="updateStock(${item.id}, this.value)" 
                    min="0" class="stock-input">
            </td>
            <td>
                <span class="stock-status ${item.stock <= item.minStock ? 'low-stock' : 'in-stock'}">
                    ${item.stock <= item.minStock ? 'Low Stock' : 'In Stock'}
                </span>
            </td>
            <td>
                <button class="edit-btn" onclick="editItem(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Fix addInventoryItem function to prevent duplicate items
function addInventoryItem(item) {
    // Validate price is a number
    const price = parseFloat(item.price);
    if (isNaN(price)) {
        alert('Please enter a valid price');
        return false;
    }

    // Add to inventory array
    const newItem = {
        id: Date.now(),
        ...item,
        price: price, // Use validated price
        stock: parseInt(item.stock),
        minStock: parseInt(item.minStock)
    };
    
    // Check for duplicates
    const isDuplicate = inventoryItems.some(existingItem => 
        existingItem.name.toLowerCase() === item.name.toLowerCase()
    );

    if (isDuplicate) {
        alert('An item with this name already exists!');
        return false;
    }

    inventoryItems.push(newItem);
    
    // Save to localStorage
    saveInventoryItems();

    // Add single item to menu grid
    const menuGrid = document.querySelector('.menu-grid');
    const menuItem = createMenuItem(newItem);
    menuGrid.appendChild(menuItem);

    updateInventoryStats();
    updateInventoryTable();
    return true;
}

// Update order management stats
function updateOrderStats() {
    const pendingCount = orders.filter(order => order.status === 'Pending').length;
    const processingCount = orders.filter(order => order.status === 'Processing').length;
    const deliveredCount = orders.filter(order => order.status === 'Delivered').length;

    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('pendingOrders').textContent = pendingCount;
    document.getElementById('processingOrders').textContent = processingCount;
    document.getElementById('deliveredOrders').textContent = deliveredCount;
}

// Update order status function
function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        updateOrdersTable();
        updateOrderStats();
    }
}

// Add this at the end of processPayment function
function processPayment() {
    // Show loading state
    const payBtn = document.getElementById('nextStep');
    payBtn.disabled = true;
    payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    // Create new order
    const order = {
        id: `ORD${Date.now()}`,
        items: cart.map(item => ({...item})),
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'Pending',
        date: new Date().toISOString(),
        customer: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : 'Guest'
    };

    // Simulate payment processing
    setTimeout(() => {
        // Add order to orders array
        orders.push(order);
        updateOrdersTable();
        updateOrderStats(); // Add this line

        // Update inventory
        order.items.forEach(item => {
            const inventoryItem = inventoryItems.find(i => i.name === item.name);
            if (inventoryItem) {
                inventoryItem.stock -= item.quantity;
            }
        });
        updateInventoryStats();
        updateInventoryTable();
        saveInventoryItems();

        // Show success animation
        document.querySelector('.payment-steps').innerHTML = `
            <div class="success-checkmark">
                <div class="check-icon">
                    <span class="icon-line line-tip"></span>
                    <span class="icon-line line-long"></span>
                </div>
            </div>
            <h3 style="text-align: center; margin-top: 2rem;">Payment Successful!</h3>
            <p style="text-align: center;">Your order #${order.id} is being processed.</p>
        `;

        // Clear cart
        cart = [];
        updateCart();

        // Close modal after delay
        setTimeout(() => {
            document.querySelector('.payment-modal').classList.remove('active');
            overlay.classList.remove('active');
        }, 2000);
    }, 2000);
}

// Add this to update inventory when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Populate menu grid with saved items
    const menuGrid = document.querySelector('.menu-grid');
    inventoryItems.forEach(item => {
        const menuItem = createMenuItem(item);
        menuGrid.appendChild(menuItem);
    });

    updateInventoryStats();
    updateInventoryTable();
});

// Activity Feed Management
let activityFeed = [];
const MAX_FEED_ITEMS = 10;

function addActivityItem(action, details) {
    const activityItem = {
        id: Date.now(),
        action,
        details,
        timestamp: new Date(),
        icon: getActivityIcon(action)
    };
    
    activityFeed.unshift(activityItem);
    if (activityFeed.length > MAX_FEED_ITEMS) {
        activityFeed.pop();
    }
    
    updateActivityFeed();
    saveActivityFeed();
}

function getActivityIcon(action) {
    const icons = {
        'add': 'fa-plus-circle text-success',
        'edit': 'fa-edit text-warning',
        'delete': 'fa-trash text-danger',
        'order': 'fa-shopping-bag text-primary',
        'stock': 'fa-box text-info',
        'login': 'fa-user-circle text-purple'
    };
    return icons[action] || 'fa-circle';
}

function updateActivityFeed() {
    const feedContainer = document.querySelector('.activity-feed ul');
    if (!feedContainer) return;

    feedContainer.innerHTML = '';
    
    activityFeed.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'activity-item';
        li.style.animation = `slideInRight 0.5s ease forwards ${index * 0.1}s`;
        li.innerHTML = `
            <div class="activity-icon">
                <i class="fas ${item.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${item.action}</div>
                <div class="activity-details">${item.details}</div>
                <div class="activity-time">${formatTimeAgo(item.timestamp)}</div>
            </div>
        `;
        feedContainer.appendChild(li);
    });
}

function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };
    
    for (let [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }
    return 'just now';
}

// Enhance existing functions to add activity feed entries
const originalAddInventoryItem = addInventoryItem;
addInventoryItem = function(item) {
    const result = originalAddInventoryItem(item);
    if (result) {
        addActivityItem('add', `Added new item: ${item.name}`);
    }
    return result;
};

const originalUpdateStock = updateStock;
updateStock = function(itemId, newStock) {
    const item = inventoryItems.find(item => item.id === itemId);
    const oldStock = item ? item.stock : 0;
    originalUpdateStock(itemId, newStock);
    if (item) {
        addActivityItem('stock', `Updated stock for ${item.name} from ${oldStock} to ${newStock}`);
    }
};

const originalDeleteItem = deleteItem;
deleteItem = function(itemId) {
    const item = inventoryItems.find(item => item.id === itemId);
    if (item) {
        addActivityItem('delete', `Deleted item: ${item.name}`);
    }
    originalDeleteItem(itemId);
};

const originalUpdateOrderStatus = updateOrderStatus;
updateOrderStatus = function(orderId, newStatus) {
    originalUpdateOrderStatus(orderId, newStatus);
    addActivityItem('order', `Updated order ${orderId} status to ${newStatus}`);
};

// Enhanced Add Product Form Validation and Preview
document.getElementById('itemImage').addEventListener('change', function(e) {
    const preview = document.getElementById('imagePreview') || createImagePreview();
    preview.src = this.value;
    preview.style.display = this.value ? 'block' : 'none';
});

function createImagePreview() {
    const preview = document.createElement('img');
    preview.id = 'imagePreview';
    preview.className = 'image-preview';
    preview.style.maxWidth = '200px';
    preview.style.marginTop = '10px';
    document.getElementById('itemImage').parentNode.appendChild(preview);
    return preview;
}

document.getElementById('addProductForm').addEventListener('input', function(e) {
    const target = e.target;
    validateField(target);
});

function validateField(field) {
    const validationRules = {
        'itemName': {
            required: true,
            minLength: 3,
            message: 'Name must be at least 3 characters long'
        },
        'itemPrice': {
            required: true,
            pattern: /^\d+(\.\d{1,2})?$/,
            message: 'Please enter a valid price (e.g., 10.99)'
        },
        'itemStock': {
            required: true,
            pattern: /^\d+$/,
            message: 'Please enter a valid number'
        },
        'itemImage': {
            required: true,
            pattern: /^https?:\/\/.+/,
            message: 'Please enter a valid image URL'
        }
    };

    const rule = validationRules[field.id];
    if (!rule) return;

    const errorElement = field.parentNode.querySelector('.field-error') || 
                        createErrorElement(field);

    let isValid = true;
    let errorMessage = '';

    if (rule.required && !field.value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (rule.minLength && field.value.length < rule.minLength) {
        isValid = false;
        errorMessage = rule.message;
    } else if (rule.pattern && !rule.pattern.test(field.value)) {
        isValid = false;
        errorMessage = rule.message;
    }

    errorElement.textContent = errorMessage;
    errorElement.style.display = isValid ? 'none' : 'block';
    field.classList.toggle('error', !isValid);

    return isValid;
}

function createErrorElement(field) {
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '4px';
    field.parentNode.appendChild(errorElement);
    return errorElement;
}

// Save and load activity feed from localStorage
function saveActivityFeed() {
    localStorage.setItem('activityFeed', JSON.stringify(activityFeed));
}

function loadActivityFeed() {
    const saved = localStorage.getItem('activityFeed');
    if (saved) {
        activityFeed = JSON.parse(saved);
        updateActivityFeed();
    }
}

// Load activity feed when page loads
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    loadActivityFeed();
});

// Contact Form Submission
function submitContactForm(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Disable form
    form.querySelectorAll('input, textarea').forEach(input => input.disabled = true);
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Simulate form submission
    setTimeout(() => {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>Thank you for your message! We'll get back to you soon.</p>
        `;
        form.appendChild(successMessage);

        // Reset form
        form.reset();

        // Re-enable form after delay
        setTimeout(() => {
            form.querySelectorAll('input, textarea').forEach(input => input.disabled = false);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            successMessage.remove();
        }, 3000);
    }, 1500);
}

// Newsletter Subscription
function subscribeNewsletter(e) {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector('input');
    const button = form.querySelector('button');
    const email = input.value;

    if (!email) return;

    // Disable form
    input.disabled = true;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    // Simulate subscription
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check"></i>';
        input.value = '';

        // Show success message
        const message = document.createElement('div');
        message.className = 'newsletter-message';
        message.innerHTML = '<i class="fas fa-check-circle"></i> Successfully subscribed!';
        form.appendChild(message);

        // Reset after delay
        setTimeout(() => {
            input.disabled = false;
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-paper-plane"></i>';
            message.remove();
        }, 3000);
    }, 1500);
}

// Add social icons hover animation
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.querySelector('i').style.animation = 'socialIconPop 0.3s forwards';
    });

    icon.addEventListener('mouseleave', function() {
        this.querySelector('i').style.animation = 'none';
        void this.querySelector('i').offsetWidth; // Trigger reflow
        this.querySelector('i').style.animation = 'socialIconPopOut 0.3s forwards';
    });
});

// Loyalty Program
const loyaltyProgram = {
    points: 0,
    level: 1,
    badges: [
        { id: 'newbie', name: 'Foodie Newbie', icon: 'fas fa-seedling', points: 0 },
        { id: 'bronze', name: 'Bronze Foodie', icon: 'fas fa-utensils', points: 100 },
        { id: 'silver', name: 'Silver Gourmet', icon: 'fas fa-medal', points: 500 },
        { id: 'gold', name: 'Gold Connoisseur', icon: 'fas fa-crown', points: 1000 },
        { id: 'platinum', name: 'Platinum Chef', icon: 'fas fa-star', points: 5000 }
    ],
    achievements: []
};

// Initialize from localStorage
function initializeLoyaltyProgram() {
    const saved = localStorage.getItem('loyaltyProgram');
    if (saved) {
        Object.assign(loyaltyProgram, JSON.parse(saved));
    }
    updateLoyaltyUI();
}

// Save to localStorage
function saveLoyaltyProgram() {
    localStorage.setItem('loyaltyProgram', JSON.stringify(loyaltyProgram));
}

// Award points
function awardPoints(amount, reason) {
    const oldPoints = loyaltyProgram.points;
    loyaltyProgram.points += amount;

    // Create achievement
    const achievement = {
        id: Date.now(),
        text: reason,
        points: amount,
        date: new Date()
    };
    loyaltyProgram.achievements.unshift(achievement);

    // Show points popup
    showPointsPopup(amount, reason);

    // Check for new badges
    checkBadges(oldPoints);

    // Update UI and save
    updateLoyaltyUI();
    saveLoyaltyProgram();
}

// Show points popup
function showPointsPopup(points, reason) {
    const popup = document.createElement('div');
    popup.className = 'points-popup';
    popup.innerHTML = `+${points} points! ${reason}`;
    
    // Position popup near the points display
    const pointsDisplay = document.querySelector('.points-display');
    const rect = pointsDisplay.getBoundingClientRect();
    popup.style.left = `${rect.left}px`;
    popup.style.top = `${rect.top}px`;

    document.querySelector('.points-popup-container').appendChild(popup);
    setTimeout(() => popup.remove(), 1500);
}

// Check for new badges
function checkBadges(oldPoints) {
    loyaltyProgram.badges.forEach(badge => {
        if (oldPoints < badge.points && loyaltyProgram.points >= badge.points) {
            // Unlock new badge animation
            const badgeElement = document.querySelector(`[data-badge-id="${badge.id}"]`);
            if (badgeElement) {
                badgeElement.classList.remove('locked');
                badgeElement.style.animation = 'unlockBadge 1s ease-out';
            }
            
            // Add achievement
            awardPoints(50, `Unlocked ${badge.name} badge!`);
        }
    });
}

// Update Loyalty UI
function updateLoyaltyUI() {
    const pointsCount = document.querySelector('.points-count');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const nextBadge = document.querySelector('.next-badge');
    const badgesContainer = document.querySelector('.badges-container');
    const achievementsContainer = document.querySelector('.achievements-container');

    // Update points
    pointsCount.textContent = loyaltyProgram.points;

    // Find next badge
    const nextBadgeObj = loyaltyProgram.badges.find(b => b.points > loyaltyProgram.points) || 
                         loyaltyProgram.badges[loyaltyProgram.badges.length - 1];
    const currentBadgeObj = loyaltyProgram.badges.reduce((prev, curr) => 
        curr.points <= loyaltyProgram.points ? curr : prev
    );

    // Update progress
    const progress = nextBadgeObj === currentBadgeObj ? 100 :
        ((loyaltyProgram.points - currentBadgeObj.points) / 
         (nextBadgeObj.points - currentBadgeObj.points)) * 100;
    
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${loyaltyProgram.points}/${nextBadgeObj.points}`;
    nextBadge.textContent = nextBadgeObj.name;

    // Update badges
    if (badgesContainer) {
        badgesContainer.innerHTML = loyaltyProgram.badges.map(badge => `
            <div class="badge-item ${loyaltyProgram.points >= badge.points ? '' : 'locked'}"
                 data-badge-id="${badge.id}">
                <i class="${badge.icon} badge-icon"></i>
                <div class="badge-name">${badge.name}</div>
            </div>
        `).join('');
    }

    // Update achievements
    if (achievementsContainer) {
        achievementsContainer.innerHTML = loyaltyProgram.achievements
            .slice(0, 5)
            .map(achievement => `
                <li class="achievement-item">
                    <div class="achievement-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div class="achievement-info">
                        <div>${achievement.text}</div>
                        <span class="achievement-points">+${achievement.points} points</span>
                    </div>
                </li>
            `).join('');
    }
}

// Modify existing functions to award points
const originalAddToCart = addToCart;
addToCart = function(menuItem) {
    originalAddToCart(menuItem);
    awardPoints(5, 'Added item to cart');
};

const originalProcessPayment = processPayment;
processPayment = function() {
    originalProcessPayment();
    const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const pointsEarned = Math.floor(orderTotal * 10); // 10 points per currency unit
    awardPoints(pointsEarned, 'Completed order');
};

// Initialize loyalty program when document loads
document.addEventListener('DOMContentLoaded', function() {
    initializeLoyaltyProgram();
    
    // Add loyalty profile button to navbar
    const navLinks = document.querySelector('.nav-links');
    navLinks.insertAdjacentHTML('beforeend', `
        <a href="#" class="loyalty-btn">
            <i class="fas fa-crown"></i>
            Rewards
        </a>
    `);

    // Add loyalty button click handler
    document.querySelector('.loyalty-btn').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.loyalty-modal').classList.add('active');
        overlay.classList.add('active');
    });

    // Add close button handler
    document.querySelector('.close-loyalty').addEventListener('click', () => {
        document.querySelector('.loyalty-modal').classList.remove('active');
        overlay.classList.remove('active');
    });
});

// Add these variables at the top
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let loginReminderTimeout;

// Add login button handler
document.querySelector('.login-btn').addEventListener('click', () => {
    document.querySelector('.login-modal').classList.add('active');
    overlay.classList.add('active');
});

// Login reminder functionality
function showLoginReminder() {
    if (!currentUser) {
        document.querySelector('.login-reminder-modal').classList.add('active');
        overlay.classList.add('active');
    }
}

function startLoginReminder() {
    loginReminderTimeout = setInterval(showLoginReminder, 40000); // 40 seconds
}

document.querySelector('.close-reminder').addEventListener('click', () => {
    document.querySelector('.login-reminder-modal').classList.remove('active');
    overlay.classList.remove('active');
});

document.querySelector('.open-login-btn').addEventListener('click', () => {
    document.querySelector('.login-reminder-modal').classList.remove('active');
    document.querySelector('.login-modal').classList.add('active');
});

// Update login form submission
document.querySelector('.login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simulated login (replace with your actual login logic)
    currentUser = {
        name: email.split('@')[0],
        email: email,
        points: 100 // Give starting points to new users
    };

    // Save user to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Update UI
    updateUserInterface();
    
    // Close modal
    document.querySelector('.login-modal').classList.remove('active');
    overlay.classList.remove('active');
});

// Update point display whenever needed
function updatePoints() {
    const pointsDisplay = document.querySelector('.points-count');
    if (pointsDisplay) {
        pointsDisplay.textContent = currentUser ? currentUser.points : 0;
    }
}

// Function to check login requirement
function requireLogin() {
    if (!currentUser) {
        showLoginReminder();
        return true;
    }
    return false;
}

// Update existing handlers to check login
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (requireLogin()) {
            e.preventDefault();
            return;
        }
        // ... existing cart logic
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (!currentUser) {
        startLoginReminder();
    }
    updatePoints();
});

// Restrict features for non-logged in users
function restrictFeatures() {
    if (!currentUser) {
        const restrictedElements = document.querySelectorAll('.add-to-cart, .cart-btn');
        restrictedElements.forEach(element => {
            element.addEventListener('click', (e) => {
                if (requireLogin()) {
                    e.preventDefault();
                }
            });
        });
    }
}

// ...existing code...

// Initialize favorites array
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Toggle favorite function
function toggleFavorite(btn) {
    const menuItem = btn.closest('.menu-item');
    const itemName = menuItem.querySelector('h3').textContent;
    const itemPrice = menuItem.querySelector('.item-price').textContent;
    const itemImage = menuItem.querySelector('.item-image').src;
    const itemDesc = menuItem.querySelector('p').textContent;
    
    const index = favorites.findIndex(item => item.name === itemName);
    
    if (index === -1) {
        // Add to favorites
        favorites.push({
            name: itemName,
            price: itemPrice,
            image: itemImage,
            description: itemDesc
        });
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-heart"></i>';
        showToast('Added to favorites!');
    } else {
        // Remove from favorites
        favorites.splice(index, 1);
        btn.classList.remove('active');
        btn.innerHTML = '<i class="far fa-heart"></i>';
        showToast('Removed from favorites!');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesSection();
}

// Update favorites section
function updateFavoritesSection() {
    const grid = document.querySelector('.favorites-grid');
    if (favorites.length === 0) {
        grid.innerHTML = `
            <div class="no-favorites">
                <i class="fas fa-heart"></i>
                <p>No favorite items yet</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = favorites.map(item => `
        <div class="menu-item" data-category="favorite">
            <img src="${item.image}" class="item-image" alt="${item.name}">
            <button class="fav-btn active" onclick="toggleFavorite(this)">
                <i class="fas fa-heart"></i>
            </button>
            <div class="item-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <span class="item-price">${item.price}</span>
                <button class="btn add-to-cart">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
    
    // Reattach event listeners
    attachCartListeners();
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }, 100);
}

// Initialize favorites on page load
document.addEventListener('DOMContentLoaded', () => {
    // ...existing init code...
    updateFavoritesSection();
    
    // Update existing favorite buttons
    document.querySelectorAll('.menu-item').forEach(item => {
        const name = item.querySelector('h3').textContent;
        const btn = item.querySelector('.fav-btn');
        if (btn && favorites.some(fav => fav.name === name)) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        }
    });
});

// ...existing code...