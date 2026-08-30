async function testAddProduct() {
  try {
    // 1. Login to get cookie
    const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@mfdesigns.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginRes.json();
    const cookie = loginRes.headers.get('set-cookie');
    
    // 2. Add product
    const productData = {
      title: 'Test New Product',
      category: 'SOLANA',
      price: 1500,
      stock: 10,
      description: 'This is a test description',
      images: [{url: 'http://example.com/img1.jpg'}, {url: 'http://example.com/img2.jpg'}, {url: 'http://example.com/img3.jpg'}],
      variants: [{size: 'Free Size', stock: 10}]
    };
    
    const res = await fetch('http://localhost:5000/api/v1/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      body: JSON.stringify(productData)
    });
    
    const resData = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', resData);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAddProduct();
