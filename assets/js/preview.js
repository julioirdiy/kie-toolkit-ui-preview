(() => {
  const materials = {
    'rumah-ibadah': {
      title: 'Modul Sampah Rumah Ibadah',
      description: 'Panduan praktis untuk membantu pengurus rumah ibadah mengelola sampah dan mengajak jamaah ikut bergerak.',
      format: 'PDF · 3,6 MB', audience: 'Pengurus rumah ibadah'
    },
    'si-pilah': {
      title: 'Si Pilah: Mulai dari Rumah',
      description: 'Materi pengenalan pemilahan sampah yang ringan untuk digunakan bersama keluarga dan komunitas.',
      format: 'PDF · 2,4 MB', audience: 'Keluarga dan komunitas'
    },
    'stop-bakar': {
      title: 'Stop Bakar Sampah Sembarangan',
      description: 'Poster edukasi untuk mengingatkan warga tentang dampak pembakaran sampah dan pilihan yang lebih baik.',
      format: 'JPG · 1,2 MB', audience: 'Masyarakat umum'
    }
  };
  const cards = [...document.querySelectorAll('.iah-material')];
  const search = document.querySelector('#search');
  const count = document.querySelector('#count');
  const detail = document.querySelector('#detail-dialog');
  const profile = document.querySelector('#profile-dialog');
  const usage = document.querySelector('#usage-dialog');
  const toast = document.querySelector('#toast');
  let activeMaterial = null;
  let profileCompleted = false;
  let activeFilter = 'all';
  let toastTimeout;

  const updateCatalog = () => {
    const term = search.value.trim().toLocaleLowerCase('id');
    let visible = 0;
    cards.forEach(card => {
      const matchesTerm = !term || card.dataset.search.toLocaleLowerCase('id').includes(term);
      const matchesFilter = activeFilter === 'all' || card.dataset.type === activeFilter;
      card.hidden = !(matchesTerm && matchesFilter);
      if (!card.hidden) visible += 1;
    });
    count.textContent = `${visible} materi ditemukan`;
  };

  document.querySelector('#search-form').addEventListener('submit', event => {
    event.preventDefault();
    updateCatalog();
  });
  search.addEventListener('input', updateCatalog);
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-current', String(item === button)));
      updateCatalog();
    });
  });

  document.querySelectorAll('[data-open-detail]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      activeMaterial = materials[link.dataset.openDetail];
      document.querySelector('#detail-title').textContent = activeMaterial.title;
      document.querySelector('#detail-description').textContent = activeMaterial.description;
      document.querySelector('#detail-format').textContent = activeMaterial.format;
      document.querySelector('#detail-audience').textContent = activeMaterial.audience;
      detail.showModal();
    });
  });

  document.querySelector('#download-button').addEventListener('click', () => {
    detail.close();
    if (!profileCompleted) profile.showModal();
    else usage.showModal();
  });
  document.querySelector('#profile-form').addEventListener('submit', event => {
    event.preventDefault();
    profileCompleted = true;
    profile.close();
    usage.showModal();
  });
  document.querySelectorAll('#usage-form input[name="audience"]').forEach(input => {
    input.addEventListener('change', () => {
      document.querySelectorAll('#usage-form input[name="audience"]').forEach(item => item.setCustomValidity(''));
    });
  });
  document.querySelector('#usage-form').addEventListener('submit', event => {
    event.preventDefault();
    const audienceSelected = document.querySelectorAll('#usage-form input[name="audience"]:checked').length > 0;
    if (!audienceSelected) {
      document.querySelector('#usage-form input[name="audience"]').setCustomValidity('Pilih setidaknya satu sasaran audiens.');
      document.querySelector('#usage-form input[name="audience"]').reportValidity();
      return;
    }
    document.querySelectorAll('#usage-form input[name="audience"]').forEach(input => input.setCustomValidity(''));
    usage.close();
    toast.textContent = `Simulasi alur “${activeMaterial.title}” selesai. Tidak ada data yang dikirim dan file tidak diunduh.`;
    toast.hidden = false;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { toast.hidden = true; }, 5500);
  });

  document.querySelectorAll('[data-close-dialog]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      link.closest('dialog').close();
    });
  });
  document.querySelector('#privacy-link').addEventListener('click', event => {
    event.preventDefault();
    toast.textContent = 'Pratinjau ini tidak mengumpulkan atau menyimpan data. Kebijakan privasi final akan ditampilkan pada website aktif.';
    toast.hidden = false;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { toast.hidden = true; }, 5500);
  });
})();
