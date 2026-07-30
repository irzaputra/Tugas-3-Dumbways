let pengeluaran = [];

const form = document.getElementById('formPengeluaran');
const namaInput = document.getElementById('namaPengeluaran');
const totalInput = document.getElementById('jumlahPengeluaran');
const pesanError = document.getElementById('pesanError');
const listFormulirA = document.getElementById('listFormulir');
const totalNilai = document.getElementById('total');
const jumlahItem = document.getElementById('itemCount');

const STORAGE_KEY = 'data_pengeluaran'

/* OBJECT FUNCTION dengan format rupiah */

function Rupiah(number) {
    return 'Rp' + number.toLocaleString('id-ID'); 
}

/* validasi jika form tidak boleh ditambahkan kalau ada input
kosong */
function ValidInput(name, total) {
    if (name === '' || total ==='' || isNaN(total)){
        return false;
    } else {
        return true;
    }
}

/* menampilkan isi array ke layar */
function renderdata(){
    listFormulirA.innerHTML = '';

    if(pengeluaran.length === 0) {
        listFormulirA.innerHTML = '<div class="empty-state">Belum ada catatan.</div>';
    } else {
        pengeluaran.forEach(function(item){
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item-pengeluaran';
            itemDiv.innerHTML = `
            <span class="name">${item.name}</span>
            <span class="lead"></span>
            <span class="total">${Rupiah(item.total)}</span>
            `;
            listFormulirA.appendChild(itemDiv);
        });
    }
    const jumlahtotal = pengeluaran.reduce(function(sum, item){ 
        return sum + item.total;
    }, 0);
    totalNilai.textContent = Rupiah(jumlahtotal);
    jumlahItem.textContent = pengeluaran.length + ' entri';
}

/* Simpan ke local storage */
function saveToLocalStorage(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pengeluaran));
}

/* Data dari local storage akan dimuat dengan json.parse
yg membuat data tetap ada walaupun di refresh */
function loadFromLocalStorage(){
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData !== null){
        pengeluaran = JSON.parse(savedData);
    } else {
        pengeluaran = [];
    }
}

function deletePengeluaran(id) {
    pengeluaran = pengeluaran.filter(function(item){ // 
        return item.id !== id;
    });
    saveToLocalStorage();
    renderdata(); // 
}

/* event submit */
form.addEventListener('submit', function (e){
    e.preventDefault();

    const name = namaInput.value.trim();
    const total = totalInput.value.trim();
    if (!ValidInput(name,total)){
        pesanError.textContent = 'Keterangan dan jumlah wajib diisi dengan benar. ';
        pesanError.classList.remove('d-none');
        namaInput.classList.toggle('input-error', name === '');
        totalInput.classList.toggle('input-error', total === '' || isNaN(total));
        return;
    }
    pesanError.textContent= '';
    pesanError.classList.add('d-none');
    namaInput.classList.remove('input-error');
    totalInput.classList.remove('input-error');

    const pengeluaranBaru = {
        id: Date.now(),
        name: name,
        total: Number(total)
    };

    pengeluaran.push(pengeluaranBaru);

    saveToLocalStorage();
    renderdata();

    form.reset();
    namaInput.focus();
});

loadFromLocalStorage();
renderdata();