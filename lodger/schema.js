export default {
  $asociatii: {
    _singular: 'asociatie',
    $incasari: {
      _singular: 'incasare',
      _sortOptions: { la: -1 },
      _defaultLimit: 25
    },
    $cheltuieli: {
      _singular: 'cheltuiala',
      _sortOptions: { la: -1 },
      _defaultLimit: 25
    },
    $blocuri: {
      _singular: 'bloc',
      $apartamente: {
        _singular: 'apartament',
        _cheiCautare: ['bloc.nume', 'scara', 'nr', 'proprietar']
      }
    }
  },
  $servicii: {
    _singular: 'serviciu'
  },
  $furnizori: {
    _singular: 'furnizor',
    _cheiCautare: ['nume']
  },
  $utilizatori: {
    _singular: 'utilizator',
    _cheiCautare: ['username', 'emailPublic']
  },
  notificari: ['error', 'warn', 'info', 'success']
}
