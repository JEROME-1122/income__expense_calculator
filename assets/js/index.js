
    let entries = JSON.parse(localStorage.getItem('entries')) ;
    let editId = null;

    function saveToLocalStorage() {
      localStorage.setItem('entries', JSON.stringify(entries));
    }

    function resetFields() {
      document.getElementById('description').value = '';
      document.getElementById('amount').value = '';
      document.getElementById('date').value = '';
      document.getElementById('type').value = 'income';
      editId = null;
    }

    function addEntry() {
      const desc = document.getElementById('description').value.trim();
      const amount = parseFloat(document.getElementById('amount').value);
      const date = document.getElementById('date').value;
      const type = document.getElementById('type').value;

      if (!desc || isNaN(amount) || !date) {
        return alert('Please fill all fields correctly.');
      }

      if (editId !== null) {
        entries[editId] = { description: desc, amount, date, type };
        editId = null;
      } else {
        entries.push({ description: desc, amount, date, type });
      }

      saveToLocalStorage();
      resetFields();
      renderEntries();
    }

    function renderEntries() {
      const tableBody = document.getElementById('entries');
      tableBody.innerHTML = '';
      const filter = document.querySelector('input[name="filter"]:checked').value;

      let income = 0, expense = 0;

      entries.forEach((entry, index) => {
        if (filter === 'all' || filter === entry.type) {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${entry.description}</td>
            <td>₹ ${entry.amount.toFixed(2)}</td>
            <td>${entry.date}</td>
            <td style="color: ${entry.type === 'income' ? 'green' : 'red'};">
              ${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
            </td>
            <td>
              <button class="edit" onclick="editEntry(${index})">Edit</button>
              <button class="delete" onclick="deleteEntry(${index})">Delete</button>
            </td>
          `;
          tableBody.appendChild(row);
        }

        if (entry.type === 'income') {
            income += entry.amount;
        }
        else {
            expense += entry.amount;
        }
      });

      document.getElementById('total-income').textContent = income.toFixed(2);
      document.getElementById('total-expense').textContent = expense.toFixed(2);
      document.getElementById('net-balance').textContent = (income - expense).toFixed(2);

      if(document.getElementById('net-balance').textContent < 0){
       document.querySelector(".balance_sec").style.backgroundColor="#555";
      }else{
        document.querySelector(".balance_sec").style.backgroundColor="#6A5ACD";
      }
    }

    function editEntry(index) {
      const entry = entries[index];
      document.getElementById('description').value = entry.description;
      document.getElementById('amount').value = entry.amount;
      document.getElementById('date').value = entry.date;
      document.getElementById('type').value = entry.type;
      editId = index;
    }

    function deleteEntry(index) {
      if (confirm('Are you sure you want to delete this entry?')) {
        entries.splice(index, 1);
        saveToLocalStorage();
        renderEntries();
      }
    }

    window.onload = renderEntries;
