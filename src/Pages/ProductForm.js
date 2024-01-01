import React, { useState } from 'react';
import { db } from '../Components/firebaseConfig'; // Adjust the path accordingly
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    name_bn: '',
    unit_price: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Convert image to base64
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
   
      // Check if "productList" collection exists
      // const productListRef = db.collection('productList');
  
      const productListRef = doc(db, 'productList', formData.name); // Replace 'customId' with your desired document ID
     
      const productListSnapshot = await getDoc(productListRef);

      if (productListSnapshot.exists()) {
        console.log('Duplicate Product Name');
        return;
      }
      /* if (productListSnapshot.empty) {
        // If the "productList" collection doesn't exist, create it
        await productListRef.add({});

        // Log that the "productList" collection was created (you can remove this line in production)
        console.log('ProductList collection created.');
      } */

      // Add product to "productList" collection
      await setDoc(productListRef, formData,);


      // Log the form data
      console.log('Product Added:', formData);

      // Reset the form after adding the product
      setFormData({
        name: '',
        name_bn: '',
        unit_price: '',
        image: null,
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full text-light-1 px-20 py-8 ">
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input-field" // Add your existing styling class
        />
      </div>
      <div>
        <label>Name (Bengali):</label>
        <input
          type="text"
          name="name_bn"
          value={formData.name_bn}
          onChange={handleChange}
          className="input-field" // Add your existing styling class
        />
      </div>
      <div>
        <label>Unit Price:</label>
        <input
          type="number"
          name="unit_price"
          value={formData.unit_price}

          onChange={handleChange}
          className="input-field" // Add your existing styling class
        />
      </div>
      <div>
        <label>Image:</label>
        <input
          type="file"
          accept="image/*"
          name="image"
          onChange={handleImageChange}
          className="input-field" // Add your existing styling class
        />
      </div>
      <div>
        <button type="submit" className="input-btn">Submit</button>
      </div>
    </form>
  );
};

export default ProductForm;
