  // Modal control functions
    function openModal(modalId) {
      document.getElementById(modalId).classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal(modalId) {
      document.getElementById(modalId).classList.remove('active');
      document.body.style.overflow = 'auto';
    }

    function closeModalOnOverlay(event, modalId) {
      if (event.target.classList.contains('modal-overlay')) {
        closeModal(modalId);
      }
    }

    // Wrapper functions that close modals after submission
    function addBillAndClose() {
      addBill(); // Your existing function
      closeModal('addBillModal');
    }

    function addSaleAndClose() {
      addSale(); // Your existing function
      closeModal('addSaleModal');
    }

    function addExpenseAndClose() {
      addExpense(); // Your existing function
      closeModal('addExpenseModal');
    }

    // Your existing functions (placeholders for demo)
    function addBill() {
      console.log('Bill added');
      // Your existing addBill logic
    }

    function addSale() {
      console.log('Sale added');
      // Your existing addSale logic
    }

    function addExpense() {
      console.log('Expense added');
      // Your existing addExpense logic
    }

    function searchBills() {
      console.log('Searching bills');
      // Your existing searchBills logic
    }

    // Demo: Toggle pages (remove this in actual implementation)
    document.addEventListener('DOMContentLoaded', function() {
      const btns = document.querySelectorAll('.btn');
      btns.forEach(btn => {
        btn.addEventListener('click', function(e) {
          if (this.textContent.includes('Vepari')) {
            e.preventDefault();
            document.getElementById('homePage').style.display = 'none';
            document.getElementById('vepariPage').style.display = 'block';
            document.getElementById('dailyPage').style.display = 'none';
          } else if (this.textContent.includes('Daily')) {
            e.preventDefault();
            document.getElementById('homePage').style.display = 'none';
            document.getElementById('vepariPage').style.display = 'none';
            document.getElementById('dailyPage').style.display = 'block';
          } else if (this.textContent.includes('Back')) {
            e.preventDefault();
            document.getElementById('homePage').style.display = 'block';
            document.getElementById('vepariPage').style.display = 'none';
            document.getElementById('dailyPage').style.display = 'none';
          }
        });
      });
    });
