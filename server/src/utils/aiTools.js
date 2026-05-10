/**
 * Definitions for Groq Function Calling (Tool Use)
 * Categorized by user roles (Buyer vs Seller)
 */

exports.getToolsForRole = (role) => {
  const buyerTools = [
    {
      type: 'function',
      function: {
        name: 'search_products',
        description: 'Search for products by keyword or category',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Product name or search keywords' },
            category: { type: 'string', description: 'Category name (e.g. Electronics, Books)' }
          }
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'get_product_details',
        description: 'Get detailed information about a specific product',
        parameters: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'The MongoDB ID of the product' }
          },
          required: ['productId']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'add_to_cart',
        description: 'Add a product to the user\'s shopping cart',
        parameters: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'The MongoDB ID of the product' },
            quantity: { type: 'number', default: 1 }
          },
          required: ['productId']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'navigate_to',
        description: 'Navigate the user to a specific page on the website',
        parameters: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'The relative URL path (e.g. /product/123, /cart, /profile)' }
          },
          required: ['path']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'get_order_status',
        description: 'Track the status of the user\'s orders',
        parameters: {
          type: 'object',
          properties: {
            orderId: { type: 'string', description: 'The MongoDB ID of the order (optional, defaults to latest)' }
          }
        }
      }
    }
  ];

  const sellerTools = [
    {
      type: 'function',
      function: {
        name: 'update_stock',
        description: 'Update the inventory stock for a product',
        parameters: {
          type: 'object',
          properties: {
            productId: { type: 'string' },
            newStock: { type: 'number' }
          },
          required: ['productId', 'newStock']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'update_product_price',
        description: 'Change the price of a product',
        parameters: {
          type: 'object',
          properties: {
            productId: { type: 'string' },
            newPrice: { type: 'number' }
          },
          required: ['productId', 'newPrice']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'get_my_orders',
        description: 'Get list of orders for the seller\'s products',
        parameters: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered'] }
          }
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'update_order_status',
        description: 'Update the status of an order',
        parameters: {
          type: 'object',
          properties: {
            orderId: { type: 'string' },
            status: { type: 'string', enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered'] }
          },
          required: ['orderId', 'status']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'update_product_status',
        description: 'Update the status or availability of a product',
        parameters: {
          type: 'object',
          properties: {
            productId: { type: 'string' },
            status: { type: 'string', description: 'e.g. In Stock, Out of Stock, Discontinued' }
          },
          required: ['productId', 'status']
        }
      }
    }
  ];

  if (role === 'seller' || role === 'admin') {
    return [...buyerTools, ...sellerTools];
  }

  return buyerTools;
};
