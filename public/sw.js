if (!self.define) {
  let e,
    a = {}
  const i = (i, r) => (
    (i = new URL(i + '.js', r).href),
    a[i] ||
      new Promise((a) => {
        if ('document' in self) {
          const e = document.createElement('script')
          ;(e.src = i), (e.onload = a), document.head.appendChild(e)
        } else (e = i), importScripts(i), a()
      }).then(() => {
        let e = a[i]
        if (!e) throw new Error(`Module ${i} didn’t register its module`)
        return e
      })
  )
  self.define = (r, s) => {
    const n =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href
    if (a[n]) return
    let c = {}
    const o = (e) => i(e, n),
      t = { module: { uri: n }, exports: c, require: o }
    a[n] = Promise.all(r.map((e) => t[e] || o(e))).then((e) => (s(...e), c))
  }
}
define(['./workbox-7c2a5a06'], function (e) {
  'use strict'
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/static/Z7dH34YeVv3xSUfQpjBeY/_buildManifest.js',
          revision: '97bf983454eddd0cfd79c773b9039ae0',
        },
        {
          url: '/_next/static/Z7dH34YeVv3xSUfQpjBeY/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/chunks/137.e96ee0fe06874b46.js',
          revision: 'e96ee0fe06874b46',
        },
        {
          url: '/_next/static/chunks/1489.d42387d89429caef.js',
          revision: 'd42387d89429caef',
        },
        {
          url: '/_next/static/chunks/2112.eff86fdf92974549.js',
          revision: 'eff86fdf92974549',
        },
        {
          url: '/_next/static/chunks/2238-f4847680225674e5.js',
          revision: 'f4847680225674e5',
        },
        {
          url: '/_next/static/chunks/2528.84467abb5693d6d8.js',
          revision: '84467abb5693d6d8',
        },
        {
          url: '/_next/static/chunks/2589.2a8c7eb50dc9253f.js',
          revision: '2a8c7eb50dc9253f',
        },
        {
          url: '/_next/static/chunks/2644-2456b62575be237b.js',
          revision: '2456b62575be237b',
        },
        {
          url: '/_next/static/chunks/3237-70e67c7309991fec.js',
          revision: '70e67c7309991fec',
        },
        {
          url: '/_next/static/chunks/3269-a6513c39f9956e9b.js',
          revision: 'a6513c39f9956e9b',
        },
        {
          url: '/_next/static/chunks/3290.1d3b3f0eeb717ce4.js',
          revision: '1d3b3f0eeb717ce4',
        },
        {
          url: '/_next/static/chunks/3541-0fed7b5079e40189.js',
          revision: '0fed7b5079e40189',
        },
        {
          url: '/_next/static/chunks/3743-fd9db0da3ca1c070.js',
          revision: 'fd9db0da3ca1c070',
        },
        {
          url: '/_next/static/chunks/3870-d73f2ad57eab05d3.js',
          revision: 'd73f2ad57eab05d3',
        },
        {
          url: '/_next/static/chunks/4076.d282dde42306b1f2.js',
          revision: 'd282dde42306b1f2',
        },
        {
          url: '/_next/static/chunks/4221-8ba64ca2369854f0.js',
          revision: '8ba64ca2369854f0',
        },
        {
          url: '/_next/static/chunks/4383.f5c874e7b9fe55cc.js',
          revision: 'f5c874e7b9fe55cc',
        },
        {
          url: '/_next/static/chunks/4523.daf1fc40eaf7e704.js',
          revision: 'daf1fc40eaf7e704',
        },
        {
          url: '/_next/static/chunks/5032.e5171ae2cbd8b3fe.js',
          revision: 'e5171ae2cbd8b3fe',
        },
        {
          url: '/_next/static/chunks/5331-65569b36c734ec12.js',
          revision: '65569b36c734ec12',
        },
        {
          url: '/_next/static/chunks/5463.dac0ea166424f84e.js',
          revision: 'dac0ea166424f84e',
        },
        {
          url: '/_next/static/chunks/5747.4e80ee1993db8a28.js',
          revision: '4e80ee1993db8a28',
        },
        {
          url: '/_next/static/chunks/5767.cdaa5f2b050f59ae.js',
          revision: 'cdaa5f2b050f59ae',
        },
        {
          url: '/_next/static/chunks/5785.522241478a07bb41.js',
          revision: '522241478a07bb41',
        },
        {
          url: '/_next/static/chunks/5821.aa00a9457b3bfe23.js',
          revision: 'aa00a9457b3bfe23',
        },
        {
          url: '/_next/static/chunks/5918.34f02a5c9b3b4d07.js',
          revision: '34f02a5c9b3b4d07',
        },
        {
          url: '/_next/static/chunks/5999.425404f884fefe1d.js',
          revision: '425404f884fefe1d',
        },
        {
          url: '/_next/static/chunks/6096-25bb93b70f764c2c.js',
          revision: '25bb93b70f764c2c',
        },
        {
          url: '/_next/static/chunks/6254-b7fda8e87ab22b91.js',
          revision: 'b7fda8e87ab22b91',
        },
        {
          url: '/_next/static/chunks/6287.df84dc36c9197179.js',
          revision: 'df84dc36c9197179',
        },
        {
          url: '/_next/static/chunks/7340-35ec95a3f740b2e2.js',
          revision: '35ec95a3f740b2e2',
        },
        {
          url: '/_next/static/chunks/7370-3261cc46e20d50cd.js',
          revision: '3261cc46e20d50cd',
        },
        {
          url: '/_next/static/chunks/7421-fd00bf2e946d9031.js',
          revision: 'fd00bf2e946d9031',
        },
        {
          url: '/_next/static/chunks/75fc9c18-2cc04cd5a8e46304.js',
          revision: '2cc04cd5a8e46304',
        },
        {
          url: '/_next/static/chunks/7604-2851a158acd9d47e.js',
          revision: '2851a158acd9d47e',
        },
        {
          url: '/_next/static/chunks/777cf710-cb713bf98502fdbb.js',
          revision: 'cb713bf98502fdbb',
        },
        {
          url: '/_next/static/chunks/8614.042e4aaa382d9071.js',
          revision: '042e4aaa382d9071',
        },
        {
          url: '/_next/static/chunks/8688-c54bf68f907a508c.js',
          revision: 'c54bf68f907a508c',
        },
        {
          url: '/_next/static/chunks/8772-346498c6754e9a45.js',
          revision: '346498c6754e9a45',
        },
        {
          url: '/_next/static/chunks/8787.e0d5998662620da6.js',
          revision: 'e0d5998662620da6',
        },
        {
          url: '/_next/static/chunks/8830-d7a80195f5dac19d.js',
          revision: 'd7a80195f5dac19d',
        },
        {
          url: '/_next/static/chunks/9632-b034f43d204df3c1.js',
          revision: 'b034f43d204df3c1',
        },
        {
          url: '/_next/static/chunks/9741-68ea26f3b11e3096.js',
          revision: '68ea26f3b11e3096',
        },
        {
          url: '/_next/static/chunks/9795.4853e4dc3217a281.js',
          revision: '4853e4dc3217a281',
        },
        {
          url: '/_next/static/chunks/9814-d3d685435b490b24.js',
          revision: 'd3d685435b490b24',
        },
        {
          url: '/_next/static/chunks/d6e1aeb5.13affe1ab03720ba.js',
          revision: '13affe1ab03720ba',
        },
        {
          url: '/_next/static/chunks/ff239f9d-f2a05bd071c2d027.js',
          revision: 'f2a05bd071c2d027',
        },
        {
          url: '/_next/static/chunks/framework-1f1fb5c07f2be279.js',
          revision: '1f1fb5c07f2be279',
        },
        {
          url: '/_next/static/chunks/main-5a2e9bca13b39dec.js',
          revision: '5a2e9bca13b39dec',
        },
        {
          url: '/_next/static/chunks/pages/_app-abd9e8040b776dae.js',
          revision: 'abd9e8040b776dae',
        },
        {
          url: '/_next/static/chunks/pages/_error-02cc11fd74b4e5ff.js',
          revision: '02cc11fd74b4e5ff',
        },
        {
          url: '/_next/static/chunks/pages/adaOTOdiSEVA-49b157b132f237f5.js',
          revision: '49b157b132f237f5',
        },
        {
          url: '/_next/static/chunks/pages/adaOTOdiSEVA/mobil-baru-0a444a70b56beb9e.js',
          revision: '0a444a70b56beb9e',
        },
        {
          url: '/_next/static/chunks/pages/adaOTOdiSEVA/mobil-baru/%5Bbrand%5D-1f1839cbe0061779.js',
          revision: '1f1839cbe0061779',
        },
        {
          url: '/_next/static/chunks/pages/adaOTOdiSEVA/mobil-baru/%5Bbrand%5D/%5Bmodel%5D/%5B%5B...slug%5D%5D-3ef78005acc1ee04.js',
          revision: '3ef78005acc1ee04',
        },
        {
          url: '/_next/static/chunks/pages/akun/profil-aea69ca3f98e4dc5.js',
          revision: 'aea69ca3f98e4dc5',
        },
        {
          url: '/_next/static/chunks/pages/akun/profil/hapus-akun-05fa370548ed6a8a.js',
          revision: '05fa370548ed6a8a',
        },
        {
          url: '/_next/static/chunks/pages/akun/profil/hapus-akun/alasan-1d0e59e39e91db7f.js',
          revision: '1d0e59e39e91db7f',
        },
        {
          url: '/_next/static/chunks/pages/akun/profil/hapus-akun/sukses-73c98b9b1f1fe9fc.js',
          revision: '73c98b9b1f1fe9fc',
        },
        {
          url: '/_next/static/chunks/pages/akun/profil/ktp/preview-3f21a8d5aa077f8b.js',
          revision: '3f21a8d5aa077f8b',
        },
        {
          url: '/_next/static/chunks/pages/akun/profil/ktp/success-ba5bf10386090bff.js',
          revision: 'ba5bf10386090bff',
        },
        {
          url: '/_next/static/chunks/pages/akun/profil/ktp/success-change-ktp-43b7856bd378d162.js',
          revision: '43b7856bd378d162',
        },
        {
          url: '/_next/static/chunks/pages/akun/profil/landing-ktp-36504cb0ee41837a.js',
          revision: '36504cb0ee41837a',
        },
        {
          url: '/_next/static/chunks/pages/index-907cae5dbd5a32b7.js',
          revision: '907cae5dbd5a32b7',
        },
        {
          url: '/_next/static/chunks/pages/instant-approval/perusahaan-pembiayaan-b698c16598ff8719.js',
          revision: 'b698c16598ff8719',
        },
        {
          url: '/_next/static/chunks/pages/instant-approval/process-59ea828633222455.js',
          revision: '59ea828633222455',
        },
        {
          url: '/_next/static/chunks/pages/instant-approval/result-3989615d8a554b91.js',
          revision: '3989615d8a554b91',
        },
        {
          url: '/_next/static/chunks/pages/instant-approval/result-success-0295e730fd3d8588.js',
          revision: '0295e730fd3d8588',
        },
        {
          url: '/_next/static/chunks/pages/instant-approval/review-c36301df9a5aa4fd.js',
          revision: 'c36301df9a5aa4fd',
        },
        {
          url: '/_next/static/chunks/pages/kalkulator-kredit/%5B%5B...slug%5D%5D-f868ff82877e369b.js',
          revision: 'f868ff82877e369b',
        },
        {
          url: '/_next/static/chunks/pages/ktp/edit-4c01a43e895a967f.js',
          revision: '4c01a43e895a967f',
        },
        {
          url: '/_next/static/chunks/pages/ktp/review-9f7c8f0047b2bb1b.js',
          revision: '9f7c8f0047b2bb1b',
        },
        {
          url: '/_next/static/chunks/pages/ktp/upload-28b8dbad247757b3.js',
          revision: '28b8dbad247757b3',
        },
        {
          url: '/_next/static/chunks/pages/ktp/verifikasi-ea8d6dff7739393a.js',
          revision: 'ea8d6dff7739393a',
        },
        {
          url: '/_next/static/chunks/pages/kualifikasi-kredit-66701ea249c60070.js',
          revision: '66701ea249c60070',
        },
        {
          url: '/_next/static/chunks/pages/kualifikasi-kredit/multi-88102c94d2770ffe.js',
          revision: '88102c94d2770ffe',
        },
        {
          url: '/_next/static/chunks/pages/kualifikasi-kredit/multi/result-82f4a2c94e50997a.js',
          revision: '82f4a2c94e50997a',
        },
        {
          url: '/_next/static/chunks/pages/kualifikasi-kredit/result-1277f8d3662d9c30.js',
          revision: '1277f8d3662d9c30',
        },
        {
          url: '/_next/static/chunks/pages/kualifikasi-kredit/result/rejected-56206428fba7f2fb.js',
          revision: '56206428fba7f2fb',
        },
        {
          url: '/_next/static/chunks/pages/kualifikasi-kredit/result/success-e721d94e64f37302.js',
          revision: 'e721d94e64f37302',
        },
        {
          url: '/_next/static/chunks/pages/kualifikasi-kredit/review-88156e07e0c1b1e2.js',
          revision: '88156e07e0c1b1e2',
        },
        {
          url: '/_next/static/chunks/pages/mobil-baru-0430e62914b1a78e.js',
          revision: '0430e62914b1a78e',
        },
        {
          url: '/_next/static/chunks/pages/mobil-baru/%5Bbrand%5D-99164f62be7f3520.js',
          revision: '99164f62be7f3520',
        },
        {
          url: '/_next/static/chunks/pages/mobil-baru/%5Bbrand%5D/%5Bmodel%5D/%5B%5B...slug%5D%5D-035a76442039e307.js',
          revision: '035a76442039e307',
        },
        {
          url: '/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js',
          revision: '837c0df77fd5009c9e46d446188ecfd0',
        },
        {
          url: '/_next/static/chunks/polyfills-core-js.dad275e059e82bf9.js',
          revision: 'dad275e059e82bf9',
        },
        {
          url: '/_next/static/chunks/polyfills-dom.0d6f98cdd0375b6a.js',
          revision: '0d6f98cdd0375b6a',
        },
        {
          url: '/_next/static/chunks/webpack-ea17261f360dfe0b.js',
          revision: 'ea17261f360dfe0b',
        },
        {
          url: '/_next/static/css/11211d7e2ac8f516.css',
          revision: '11211d7e2ac8f516',
        },
        {
          url: '/_next/static/css/230931620dd94df6.css',
          revision: '230931620dd94df6',
        },
        {
          url: '/_next/static/css/232e63d4f993a63e.css',
          revision: '232e63d4f993a63e',
        },
        {
          url: '/_next/static/css/27b5ce423481c8e4.css',
          revision: '27b5ce423481c8e4',
        },
        {
          url: '/_next/static/css/2faac25904011540.css',
          revision: '2faac25904011540',
        },
        {
          url: '/_next/static/css/3290ead645e17888.css',
          revision: '3290ead645e17888',
        },
        {
          url: '/_next/static/css/37de2661ee4546b1.css',
          revision: '37de2661ee4546b1',
        },
        {
          url: '/_next/static/css/3fd8c711779a4da3.css',
          revision: '3fd8c711779a4da3',
        },
        {
          url: '/_next/static/css/4220bc5604818083.css',
          revision: '4220bc5604818083',
        },
        {
          url: '/_next/static/css/4a38abe11e35c907.css',
          revision: '4a38abe11e35c907',
        },
        {
          url: '/_next/static/css/4cbc1e9b13a61cd0.css',
          revision: '4cbc1e9b13a61cd0',
        },
        {
          url: '/_next/static/css/4e40cc95c3930b59.css',
          revision: '4e40cc95c3930b59',
        },
        {
          url: '/_next/static/css/527abaa10cd14fbf.css',
          revision: '527abaa10cd14fbf',
        },
        {
          url: '/_next/static/css/5a3472de85a0e71c.css',
          revision: '5a3472de85a0e71c',
        },
        {
          url: '/_next/static/css/643436fc56849403.css',
          revision: '643436fc56849403',
        },
        {
          url: '/_next/static/css/71517cbf0f724411.css',
          revision: '71517cbf0f724411',
        },
        {
          url: '/_next/static/css/786997738a70b107.css',
          revision: '786997738a70b107',
        },
        {
          url: '/_next/static/css/87694a318116eff7.css',
          revision: '87694a318116eff7',
        },
        {
          url: '/_next/static/css/8f6a8760fec44069.css',
          revision: '8f6a8760fec44069',
        },
        {
          url: '/_next/static/css/9232080ae666992b.css',
          revision: '9232080ae666992b',
        },
        {
          url: '/_next/static/css/930b586206a6d4f2.css',
          revision: '930b586206a6d4f2',
        },
        {
          url: '/_next/static/css/9cf2d8cfcdde89b9.css',
          revision: '9cf2d8cfcdde89b9',
        },
        {
          url: '/_next/static/css/a59b73f1907e0be3.css',
          revision: 'a59b73f1907e0be3',
        },
        {
          url: '/_next/static/css/b03c5f5882f01764.css',
          revision: 'b03c5f5882f01764',
        },
        {
          url: '/_next/static/css/b0579da33240ac63.css',
          revision: 'b0579da33240ac63',
        },
        {
          url: '/_next/static/css/bb167a165b7306dd.css',
          revision: 'bb167a165b7306dd',
        },
        {
          url: '/_next/static/css/bbaa98c75261f812.css',
          revision: 'bbaa98c75261f812',
        },
        {
          url: '/_next/static/css/c1dfa95ff0fb39ec.css',
          revision: 'c1dfa95ff0fb39ec',
        },
        {
          url: '/_next/static/css/dcdfee21cdebf60e.css',
          revision: 'dcdfee21cdebf60e',
        },
        {
          url: '/_next/static/css/e15cba3957d557f4.css',
          revision: 'e15cba3957d557f4',
        },
        {
          url: '/_next/static/css/fc5f558fce6bf135.css',
          revision: 'fc5f558fce6bf135',
        },
        {
          url: '/_next/static/media/1783a73d1694d38f.p.woff2',
          revision: 'a8168efe03f831b205165cf3b2e5fb6d',
        },
        {
          url: '/_next/static/media/258196c4df74bb26.p.woff2',
          revision: 'ac6121dd7f045d6d7910df694a65de73',
        },
        {
          url: '/_next/static/media/392e6f0f021ffbd8.p.otf',
          revision: 'e1d21457d17911d83fab829c6a52138f',
        },
        {
          url: '/_next/static/media/6cdc7e676af368ff.p.otf',
          revision: '65efeaeb62e6ce3040d4cb21d9e18477',
        },
        {
          url: '/_next/static/media/849771f6468adc31.p.woff2',
          revision: '058275e07c21242a9bcf0a7c95352a09',
        },
        {
          url: '/_next/static/media/87a8af1d55d8f70e.p.otf',
          revision: '9ea1f5bc0d2bc67ede28da670baff9bc',
        },
        {
          url: '/_next/static/media/9901c09b904c1b1b.p.woff2',
          revision: 'd2208dd95f53dc18e763fa247f662f1c',
        },
        {
          url: '/_next/static/media/background.d91c6166.svg',
          revision: 'd91c6166',
        },
        {
          url: '/_next/static/media/compass.b67df886.svg',
          revision: 'b67df886',
        },
        {
          url: '/_next/static/media/eb47cd81b466815e.p.otf',
          revision: 'e95e530215ea089fc6272e2b3e5fe1aa',
        },
        { url: '/_next/static/media/grab.9456cfe4.svg', revision: '9456cfe4' },
        {
          url: '/_next/static/media/grabbing.d045e2c0.svg',
          revision: 'd045e2c0',
        },
        {
          url: '/_next/static/media/sprites.ef90573e.svg',
          revision: 'ef90573e',
        },
        { url: '/favicon.ico', revision: 'c30c7d42707a47a3f4591831641e50dc' },
        { url: '/favicon.png', revision: '15737d95fb1cfe4a27e894d62f4e97e3' },
        {
          url: '/icon-512x512.png',
          revision: '8afc03adb947fdb401cc9a661d12f196',
        },
        { url: '/icon.png', revision: '68099a2c28a233f95509b9302f6b1a35' },
        { url: '/manifest.json', revision: '428c7a095599504dfd2921a9b9fe101c' },
        { url: '/next.svg', revision: '8e061864f388b47f33a1c3780831193e' },
        {
          url: '/revamp/fonts/Kanyon/Kanyon-Bold.otf',
          revision: '65efeaeb62e6ce3040d4cb21d9e18477',
        },
        {
          url: '/revamp/fonts/Kanyon/Kanyon-Light.otf',
          revision: 'e95e530215ea089fc6272e2b3e5fe1aa',
        },
        {
          url: '/revamp/fonts/Kanyon/Kanyon-Medium.otf',
          revision: 'e1d21457d17911d83fab829c6a52138f',
        },
        {
          url: '/revamp/fonts/Kanyon/Kanyon-Regular.otf',
          revision: '9ea1f5bc0d2bc67ede28da670baff9bc',
        },
        {
          url: '/revamp/fonts/OpenSans/OpenSans-Bold.woff2',
          revision: 'd2208dd95f53dc18e763fa247f662f1c',
        },
        {
          url: '/revamp/fonts/OpenSans/OpenSans-ExtraBold.woff2',
          revision: '058275e07c21242a9bcf0a7c95352a09',
        },
        {
          url: '/revamp/fonts/OpenSans/OpenSans-Light.woff2',
          revision: '630d91b251a256788f3488c512585fcd',
        },
        {
          url: '/revamp/fonts/OpenSans/OpenSans-Regular.woff2',
          revision: 'ac6121dd7f045d6d7910df694a65de73',
        },
        {
          url: '/revamp/fonts/OpenSans/OpenSans-SemiBold.woff2',
          revision: 'a8168efe03f831b205165cf3b2e5fb6d',
        },
        {
          url: '/revamp/icon/AstraLogo.webp',
          revision: '9e3e70e201882c06fa25345d504e0822',
        },
        {
          url: '/revamp/icon/Daihatsu.png',
          revision: 'c1d798610083f67ea223fdd86b7c16e7',
        },
        {
          url: '/revamp/icon/FlagIndonesia.svg',
          revision: '3b3a87cb16a3677f2c3b8f73dffa7b9d',
        },
        {
          url: '/revamp/icon/IconAstraPay.webp',
          revision: '5a80213fddb2277a0b42780892046e2a',
        },
        {
          url: '/revamp/icon/Isuzu-new.png',
          revision: '493df90e28d93174ffb87225e9da26af',
        },
        {
          url: '/revamp/icon/Logo-Astra-Financial.webp',
          revision: '469ed96ede9fb482cb5fd69219886211',
        },
        {
          url: '/revamp/icon/Logo-BMW-potrait.webp',
          revision: 'cf1e5c9a902b935829d6c95c09360522',
        },
        {
          url: '/revamp/icon/Logo-Daihatsu-potrait.webp',
          revision: 'c1d798610083f67ea223fdd86b7c16e7',
        },
        {
          url: '/revamp/icon/Logo-Isuzu-potrait.webp',
          revision: 'c1dacd63d8960fedb142dc11ae2dd0d9',
        },
        {
          url: '/revamp/icon/Logo-Peugeot-potrait.webp',
          revision: '50d1639da23714ce52acd88a738cba56',
        },
        {
          url: '/revamp/icon/Logo-Potrait-BMW.webp',
          revision: 'f5edcff0bbf3072d3527b83991f8f642',
        },
        {
          url: '/revamp/icon/Logo-Potrait-Daihatsu.webp',
          revision: '29a42d71ab90d8bfc3901c3709b8be5d',
        },
        {
          url: '/revamp/icon/Logo-Potrait-Isuzu.webp',
          revision: 'd313de8c5f0d9b619c4c2ad9da7193d5',
        },
        {
          url: '/revamp/icon/Logo-Potrait-Peugeot.webp',
          revision: '4a6b1cebd5b5263ef1f6a2d12314ceed',
        },
        {
          url: '/revamp/icon/Logo-Potrait-Toyota.webp',
          revision: '0d91a2ffc82c8e13b6490ed3eb12a0d1',
        },
        {
          url: '/revamp/icon/Logo-TAF.png',
          revision: 'b38bcce838d73c48a887b2c7da36f0c3',
        },
        {
          url: '/revamp/icon/Logo-Toyota-potrait.webp',
          revision: 'f48c6a78e47fa3b704d3588083743c33',
        },
        {
          url: '/revamp/icon/OldBodyTypesIcon/Car_Type_Icons_Crossover.png',
          revision: '873811fa116819fd0c418b82e1ca3fe4',
        },
        {
          url: '/revamp/icon/OldBodyTypesIcon/Car_Type_Icons_Hatchback.png',
          revision: '7110b7ea6cb5624dd636f00f58ba33e7',
        },
        {
          url: '/revamp/icon/OldBodyTypesIcon/Car_Type_Icons_MPV.png',
          revision: '13ba7d60b648cac65451bdd1c91349aa',
        },
        {
          url: '/revamp/icon/OldBodyTypesIcon/Car_Type_Icons_Minivan.png',
          revision: '5507ebbae214be5d81bc35111f227d9b',
        },
        {
          url: '/revamp/icon/OldBodyTypesIcon/Car_Type_Icons_SUV.png',
          revision: '319d502db2b5f23849bd4997e1450d76',
        },
        {
          url: '/revamp/icon/OldBodyTypesIcon/Car_Type_Icons_Sedan.png',
          revision: 'c2d52b67e91cb0e252adfa041d494900',
        },
        {
          url: '/revamp/icon/OldBodyTypesIcon/Car_Type_Icons_Sport.png',
          revision: '22b58f2856f249e884a7abee4c90a31e',
        },
        {
          url: '/revamp/icon/OldShareEmailLogo.webp',
          revision: '12bdcab3c6947cd42bf4919a6476cd54',
        },
        {
          url: '/revamp/icon/OldShareTwitterLogo.webp',
          revision: '19d51323b7b051287fc80be26fed6a59',
        },
        {
          url: '/revamp/icon/OldShareWhatsappLogo.webp',
          revision: '4371bd5a05fd29e2183c9437d00b1d56',
        },
        {
          url: '/revamp/icon/OldTafLogo.webp',
          revision: '2e496180dcf0d033f38eb5ba86a4e547',
        },
        {
          url: '/revamp/icon/app-store.webp',
          revision: 'eaddc9f13c03e3c89d7d9d266f270dd2',
        },
        {
          url: '/revamp/icon/arrowLeftSmall.svg',
          revision: 'dac22733bfa0dd7619f3287e427d2bd8',
        },
        {
          url: '/revamp/icon/arrowLeftSmall.webp',
          revision: 'd8ed2bf6bf43dd4b83778bae7e16b18b',
        },
        {
          url: '/revamp/icon/arrowRightSmall.svg',
          revision: 'bf7b6c22d9a35bc3e18ebef7cb738ac0',
        },
        {
          url: '/revamp/icon/arrowRightSmall.webp',
          revision: '71d7203c845ef8991d1d1c2c6b3e9bf3',
        },
        {
          url: '/revamp/icon/checked.webp',
          revision: '95bdd8c58f54cda4aa7df0bfbf0366e3',
        },
        {
          url: '/revamp/icon/chevron-left.webp',
          revision: '6ef4a747bc0089dd8d553dc58b422574',
        },
        {
          url: '/revamp/icon/chevron-right-icon.webp',
          revision: 'c32ee38ed2974fd5cc694b184f25d63e',
        },
        {
          url: '/revamp/icon/daihatsu-update.png',
          revision: '7489f2abe14bd59c7946c510dfa628ae',
        },
        {
          url: '/revamp/icon/facebook-outline.png',
          revision: '3f0461a5d732f6a19e526197d88517b9',
        },
        {
          url: '/revamp/icon/google-play.webp',
          revision: 'ec053f2958702fd5998a87e8983dba0d',
        },
        {
          url: '/revamp/icon/iso.webp',
          revision: '3c1c6dcfa9db0afb702c77569cfdb166',
        },
        {
          url: '/revamp/icon/logo-acc.webp',
          revision: '41df7ddb4f3c6bc3c97cae19a76b3751',
        },
        {
          url: '/revamp/icon/logo-bmw-min.png',
          revision: '03e2773e222ff0730b59564a01d29db2',
        },
        {
          url: '/revamp/icon/logo-bmw.webp',
          revision: '0708736a4dbdc78cddb3d5224260f706',
        },
        {
          url: '/revamp/icon/logo-daihatsu-min.png',
          revision: '43cc8783e881ab28f365bdfa28fce93e',
        },
        {
          url: '/revamp/icon/logo-daihatsu.webp',
          revision: '957c5ebdaa0bf44179a2a5566f151c4d',
        },
        {
          url: '/revamp/icon/logo-isuzu.webp',
          revision: 'ad48a1e37472415a1e97dae3b8f32fa4',
        },
        {
          url: '/revamp/icon/logo-on-dark.webp',
          revision: 'e34cb0a77d2dfe2ca6a7f541020539b5',
        },
        {
          url: '/revamp/icon/logo-peugeot.webp',
          revision: 'e4d97349e50ecd8fae41604c72dd9267',
        },
        {
          url: '/revamp/icon/logo-primary.webp',
          revision: '654d17777aa6f2f174d353852c98b72b',
        },
        {
          url: '/revamp/icon/logo-question-mark.png',
          revision: '5c01a4f31ac9d09e4de626a2e3efd9fa',
        },
        {
          url: '/revamp/icon/logo-secondary.webp',
          revision: '68bb549584628533049479bb9005edc3',
        },
        {
          url: '/revamp/icon/logo-taf.webp',
          revision: '21d28fc31838992f9f69ee162469125a',
        },
        {
          url: '/revamp/icon/logo-toyota-min.png',
          revision: '7cf1896ddbd655d9890ef00e2ac01275',
        },
        {
          url: '/revamp/icon/logo-toyota.webp',
          revision: 'cb87980e45901370190e45550703b963',
        },
        {
          url: '/revamp/icon/peugeot.png',
          revision: '8fe30031139c52624a586cf512387030',
        },
        {
          url: '/revamp/icon/thumbnail-primary.webp',
          revision: '1cf81091709aa1f90fba0d27c9ceab5a',
        },
        {
          url: '/revamp/icon/thumbnail-secondary.webp',
          revision: 'c5dc0685721464918cbd04daed6b6eb2',
        },
        {
          url: '/revamp/icon/toyota-1989.png',
          revision: '91b2004cd3f387428d74ba34b09c86df',
        },
        {
          url: '/revamp/illustration/CarNotExistImg.webp',
          revision: '235ba3f9de85f4ecee20123cdcdcced0',
        },
        {
          url: '/revamp/illustration/Car_Type_Icons_Crossover.png',
          revision: '873811fa116819fd0c418b82e1ca3fe4',
        },
        {
          url: '/revamp/illustration/Car_Type_Icons_Hatchback.png',
          revision: '7110b7ea6cb5624dd636f00f58ba33e7',
        },
        {
          url: '/revamp/illustration/Car_Type_Icons_MPV.png',
          revision: '13ba7d60b648cac65451bdd1c91349aa',
        },
        {
          url: '/revamp/illustration/Car_Type_Icons_Minivan.png',
          revision: '5507ebbae214be5d81bc35111f227d9b',
        },
        {
          url: '/revamp/illustration/Car_Type_Icons_SUV.png',
          revision: '319d502db2b5f23849bd4997e1450d76',
        },
        {
          url: '/revamp/illustration/Car_Type_Icons_Sedan.png',
          revision: 'c2d52b67e91cb0e252adfa041d494900',
        },
        {
          url: '/revamp/illustration/Car_Type_Icons_Sport.png',
          revision: '22b58f2856f249e884a7abee4c90a31e',
        },
        {
          url: '/revamp/illustration/EmptyCalculationImage.webp',
          revision: 'dd2f4d7e754e45af49f9332a8cd64d40',
        },
        {
          url: '/revamp/illustration/FlagIndonesiaNew.png',
          revision: '876ce13d6b21508aca4251998945b5b3',
        },
        {
          url: '/revamp/illustration/FlagUSA.png',
          revision: 'd56727a437b0290044bbe9fcb7b4ad3b',
        },
        {
          url: '/revamp/illustration/Forward.svg',
          revision: 'fb5ab515a04e6156962b1462d18914de',
        },
        {
          url: '/revamp/illustration/KTP.webp',
          revision: '7ac26ff8942ecf09027c89b8200b7d3b',
        },
        {
          url: '/revamp/illustration/OldCitySelectorBackgroundMobile.webp',
          revision: '1fe3f2b9ccc4abad3f535d914683e1a0',
        },
        {
          url: '/revamp/illustration/Profile.svg',
          revision: 'b7f447ea36a35c4463add8895f2ad1cd',
        },
        {
          url: '/revamp/illustration/PromoAsuransi.gif',
          revision: 'dad3679a27ecb37b81c6a39b59add783',
        },
        {
          url: '/revamp/illustration/PromoCumaDiSEVA.webp',
          revision: '6b1fedc42d8831d96a64e2b3a2d42aa1',
        },
        {
          url: '/revamp/illustration/PromoCumaDiSEVAPopup.webp',
          revision: '1ddf2cb8d0464e387dc797f796d6056c',
        },
        {
          url: '/revamp/illustration/PromoTSO.webp',
          revision: '923a6ceae410f7451f1d617f0086a0be',
        },
        {
          url: '/revamp/illustration/PromoTSOPopup.webp',
          revision: '84606f690793fc0e9bffdbde05d6fff5',
        },
        {
          url: '/revamp/illustration/PromoTradeIn.webp',
          revision: '7a7b860b94dbe0702009ab0cab6a600d',
        },
        {
          url: '/revamp/illustration/PromoTradeInPopup.webp',
          revision: 'b2914110f5230ea044fb789fde069ce9',
        },
        {
          url: '/revamp/illustration/Register.png',
          revision: '27bc351f05ed23bff5e0d5a560fbe741',
        },
        {
          url: '/revamp/illustration/announcement-box/christmas-desktop-left.webp',
          revision: '6071bfc95a1e33b2055e320d7dab365f',
        },
        {
          url: '/revamp/illustration/announcement-box/christmas-desktop-right.webp',
          revision: 'c2fc62b52c1eec55eddb2801779f3f04',
        },
        {
          url: '/revamp/illustration/announcement-box/christmas-mobile-left.webp',
          revision: '1b42ffaf213ac1e654565ed1b3e64c7b',
        },
        {
          url: '/revamp/illustration/announcement-box/christmas-mobile-right.webp',
          revision: '2ac258f4269d1b2f59c469f14c1e2aa8',
        },
        {
          url: '/revamp/illustration/announcement-box/cny-desktop-left.svg',
          revision: '62945b7f0b66fcff4378f71a2ad3fe36',
        },
        {
          url: '/revamp/illustration/announcement-box/cny-desktop-right.svg',
          revision: 'b3934dd989360e78ac99614b917f9c08',
        },
        {
          url: '/revamp/illustration/announcement-box/cny-mobile-left.svg',
          revision: 'f7b2cec1cffb353b9007ff5c6acac295',
        },
        {
          url: '/revamp/illustration/announcement-box/cny-mobile-right.svg',
          revision: '21daaccf9b0702cf0a19127a64b4faa8',
        },
        {
          url: '/revamp/illustration/announcement-box/custom-desktop-left.webp',
          revision: 'fdcc1c5bfd006b5f561d52e1fec9cc80',
        },
        {
          url: '/revamp/illustration/announcement-box/custom-desktop-right.webp',
          revision: '85c02f5922297e461b1e1651286f6df1',
        },
        {
          url: '/revamp/illustration/announcement-box/custom-mobile-right.webp',
          revision: '034b06449cdf7ec96403fb370a02f6c5',
        },
        {
          url: '/revamp/illustration/announcement-box/idulfitri2023-desktop-left.svg',
          revision: '383ba8399a142cd71623baee224c6ce1',
        },
        {
          url: '/revamp/illustration/announcement-box/idulfitri2023-desktop-right.svg',
          revision: 'd6e8079b649f1f44126ae61e96486561',
        },
        {
          url: '/revamp/illustration/announcement-box/idulfitri2023-mobile-left.svg',
          revision: '9a49615731b07ef0eb08f200fae52d8b',
        },
        {
          url: '/revamp/illustration/announcement-box/idulfitri2023-mobile-right.svg',
          revision: 'cca540bbc4ee5d15e3975774f30bcade',
        },
        {
          url: '/revamp/illustration/announcement-box/newyear-desktop-left.webp',
          revision: 'db8cbf637f8ba5d4829fb5a92f719040',
        },
        {
          url: '/revamp/illustration/announcement-box/newyear-desktop-right.webp',
          revision: 'e940b26ef786a72880ad8491478a3a07',
        },
        {
          url: '/revamp/illustration/announcement-box/newyear-mobile-left.webp',
          revision: 'bde8b9e9de927a4f0fbd99dc81ed7f1b',
        },
        {
          url: '/revamp/illustration/announcement-box/newyear-mobile-right.webp',
          revision: 'ed126235d052b373fd503bbc4eaf41c3',
        },
        {
          url: '/revamp/illustration/announcement-box/ramadhan-desktop-left.svg',
          revision: 'e49ddd98ea44f1b1085edd6cfca3bbdc',
        },
        {
          url: '/revamp/illustration/announcement-box/ramadhan-desktop-right.svg',
          revision: '0c5078ff4d31736f9c04f1c45646a851',
        },
        {
          url: '/revamp/illustration/announcement-box/ramadhan-mobile-left.svg',
          revision: 'deda340cd5df679402e7b71fbfa4455a',
        },
        {
          url: '/revamp/illustration/announcement-box/ramadhan-mobile-right.svg',
          revision: '9b770a19de91ae0829dc0d9e5183de03',
        },
        {
          url: '/revamp/illustration/approval.webp',
          revision: '13e9ed595e10649b803542cb81adf7aa',
        },
        {
          url: '/revamp/illustration/approve-acc.webp',
          revision: '0d53770a8e59b50b86a9adf3438f1c95',
        },
        {
          url: '/revamp/illustration/approve-taf.webp',
          revision: '0d97030568c9d17a4c4c15bb0261dea0',
        },
        {
          url: '/revamp/illustration/approved.webp',
          revision: 'a84d835f283d6212b31fb5a844e8e64b',
        },
        {
          url: '/revamp/illustration/background-desktop-green.webp',
          revision: 'cb20f47d1b7d6463ed0fbca4bbac3072',
        },
        {
          url: '/revamp/illustration/background-desktop-red.webp',
          revision: '61774262e6a24cbe7041d52be51ce50d',
        },
        {
          url: '/revamp/illustration/background-desktop.webp',
          revision: '8f26dd56652392faeedcd5796d74b7f7',
        },
        {
          url: '/revamp/illustration/background-image-desktop.webp',
          revision: '6a2e623501a4ea1edde59fc171bf1bc4',
        },
        {
          url: '/revamp/illustration/banner_qualifacation.webp',
          revision: '7c4e7689620bfe7b7012dd5185245d16',
        },
        {
          url: '/revamp/illustration/bg-landing-ia.webp',
          revision: '57d551af138e5150623cc8d32f378d15',
        },
        {
          url: '/revamp/illustration/buttonLeft.svg',
          revision: '197f90fb97831404292ba70b9bfbf1e5',
        },
        {
          url: '/revamp/illustration/buttonRight.svg',
          revision: 'ad17069b6b06dc300fadfd63bb091416',
        },
        {
          url: '/revamp/illustration/car-icon copy.webp',
          revision: 'd19c73bbe564cff27aee44daddeb3529',
        },
        {
          url: '/revamp/illustration/car-icon.webp',
          revision: 'd19c73bbe564cff27aee44daddeb3529',
        },
        {
          url: '/revamp/illustration/car-main-hero-skeleton copy.webp',
          revision: 'e1273c66263ce08256e809e6704b76b1',
        },
        {
          url: '/revamp/illustration/car-main-hero-skeleton.webp',
          revision: 'e1273c66263ce08256e809e6704b76b1',
        },
        {
          url: '/revamp/illustration/car-not-exist.webp',
          revision: '7d8de6722c5f129325560fa0b9b4fcbf',
        },
        {
          url: '/revamp/illustration/car-sillhouete.webp',
          revision: 'ed2a2c3cbe52109329dc794abe9ca78b',
        },
        {
          url: '/revamp/illustration/car-skeleton.webp',
          revision: 'cf1daaff394efff1c83ed986d5723736',
        },
        {
          url: '/revamp/illustration/car_search_desktop.png',
          revision: 'dd70c6568710487b08ab33748ed9afcd',
        },
        {
          url: '/revamp/illustration/car_search_mobile.png',
          revision: '98b4ac032b9d1cc565574355b736788a',
        },
        {
          url: '/revamp/illustration/credit-result-green-female.webp',
          revision: 'ad6710a7a84df4a39c9ad806c8e52435',
        },
        {
          url: '/revamp/illustration/credit-result-green-male.webp',
          revision: 'f0cee196a7a065435356ddd8ba6362e6',
        },
        {
          url: '/revamp/illustration/credit-result-magnifier.webp',
          revision: '5063c38cabf371089963b9ecdaa0ce3e',
        },
        {
          url: '/revamp/illustration/credit-result-red-background.webp',
          revision: 'f40fe1259f1918d39568a7ae26d5f018',
        },
        {
          url: '/revamp/illustration/credit-result-yellow-female.webp',
          revision: 'aab4129901db8144b5585fbbc8b4de93',
        },
        {
          url: '/revamp/illustration/credit-result-yellow-male.webp',
          revision: '74df09c378914b530f7fe9ab89936b43',
        },
        {
          url: '/revamp/illustration/empty-car.webp',
          revision: '03548b293758332d154262e9edaec02d',
        },
        {
          url: '/revamp/illustration/error.webp',
          revision: '4edd3677964e4eb7e22354d2633721b4',
        },
        {
          url: '/revamp/illustration/ia-approval.webp',
          revision: '81b25c2337eb27c9d40c5b841c6f0e67',
        },
        {
          url: '/revamp/illustration/ia-approved.webp',
          revision: 'd165e504d725b3d8d8d07996dda77b19',
        },
        {
          url: '/revamp/illustration/ia-rejected.webp',
          revision: '5c919736a96c414b5c217a7ce24425da',
        },
        {
          url: '/revamp/illustration/ia-waiting.webp',
          revision: '6c9c8866a2802bfde5bba08917d0e837',
        },
        {
          url: '/revamp/illustration/ilustration-login-modal.webp',
          revision: '7b7dfc493d2eb665c8a2c5d093d6f4bd',
        },
        {
          url: '/revamp/illustration/image-unavailable-desktop.webp',
          revision: '3b3698fb7f905c20ca37891aae35e4b1',
        },
        {
          url: '/revamp/illustration/jumpa-pay-modal-bg.webp',
          revision: '7f99e1121196327f3f28f3706c261bb8',
        },
        {
          url: '/revamp/illustration/kualifikasi-kredit.webp',
          revision: 'bafc9918cca107ce443799df5100c0d8',
        },
        {
          url: '/revamp/illustration/landing-ia.webp',
          revision: 'ebb67729b5963687a98eed2f83b67332',
        },
        {
          url: '/revamp/illustration/loan-calculator.webp',
          revision: 'fe7e0592cad9018291ab17b3bcdd1568',
        },
        {
          url: '/revamp/illustration/logo-giias.webp',
          revision: '6d8f644e10a6232fda9067a6ac97c0e4',
        },
        {
          url: '/revamp/illustration/main-hero-raize-cencored.webp',
          revision: 'b1f4b908ac9d9d33f1874429c0174230',
        },
        {
          url: '/revamp/illustration/main-hero-raize.webp',
          revision: 'becf4ec4565628e0a903755b148141ae',
        },
        {
          url: '/revamp/illustration/placeholder-150.webp',
          revision: '7f4afd37783823bc54817cf3714a70d0',
        },
        {
          url: '/revamp/illustration/placeholder.gif',
          revision: '3da2d4659243005f83008feaeb9dc9aa',
        },
        {
          url: '/revamp/illustration/plp-empty.webp',
          revision: 'b4add6b7a109877518859775f52b0a0d',
        },
        {
          url: '/revamp/illustration/promo-1.webp',
          revision: 'e286f6e82122744adc3ceffe08973173',
        },
        {
          url: '/revamp/illustration/promo-icon.webp',
          revision: 'ecd4284eef0f83394ec42f9877d5e330',
        },
        {
          url: '/revamp/illustration/promo-image-1.webp',
          revision: 'f7d3565834b744f4353bb70a3828aa8a',
        },
        {
          url: '/revamp/illustration/rejected-approval.webp',
          revision: '8dc093aac6de88923700de2cc098d042',
        },
        {
          url: '/revamp/illustration/rp-icon copy.webp',
          revision: '91e4d208160f9954e81cff5fbfdea989',
        },
        {
          url: '/revamp/illustration/rp-icon.webp',
          revision: '91e4d208160f9954e81cff5fbfdea989',
        },
        {
          url: '/revamp/illustration/seva-header.svg',
          revision: '1aac959419ed23a010f016a13aef32c7',
        },
        {
          url: '/revamp/illustration/sub-product-1.webp',
          revision: 'e926c4c1afca17ad1e39b0be2a2e4dfc',
        },
        {
          url: '/revamp/illustration/sub-product-2.webp',
          revision: '44badf572884986db724741077a603fc',
        },
        {
          url: '/revamp/illustration/subtract-left.png',
          revision: 'e45858fd53b8c1c69c0b4d088bd6b39c',
        },
        {
          url: '/revamp/illustration/subtract-right.png',
          revision: '2b214cfd77cf4bb386a892a86f7982aa',
        },
        {
          url: '/revamp/illustration/success-verification.webp',
          revision: 'cce1117a9f889e75a836fb211dd4ac90',
        },
        {
          url: '/revamp/illustration/supergraphic-2.webp',
          revision: 'fa36bb280878e624ea2c0da3957859f1',
        },
        {
          url: '/revamp/illustration/supergraphic-crop.webp',
          revision: '50db815e5d3cb5c69fc61549e0e02099',
        },
        {
          url: '/revamp/illustration/supergraphic-large.webp',
          revision: 'd6b92e35e433e8da55db8dca98d9b15c',
        },
        {
          url: '/revamp/illustration/supergraphic-mobile.webp',
          revision: '7b32ed5edd78dfbb6076e1cea7747871',
        },
        {
          url: '/revamp/illustration/supergraphic-secondary-large.webp',
          revision: '2bfc564dc11e9e2ebd45e39f11d9ba46',
        },
        {
          url: '/revamp/illustration/supergraphic-secondary-small.webp',
          revision: '1d893f69e00217ec924abf00bce0ef34',
        },
        {
          url: '/revamp/illustration/supergraphic-small.webp',
          revision: '15240a98f24c448a76fe24f55bc05c34',
        },
        {
          url: '/revamp/illustration/vector-6.png',
          revision: 'c8153c23c964fad07603e068fd12fafd',
        },
        {
          url: '/revamp/illustration/vector-7.png',
          revision: 'c1f8443062d7f22fb7c2efab9f58fed7',
        },
        {
          url: '/revamp/illustration/wishlist.webp',
          revision: 'db49a875011945e4de7927ebad152d96',
        },
        {
          url: '/revamp/images/announcementBox/christmas-desktop-left.webp',
          revision: '6071bfc95a1e33b2055e320d7dab365f',
        },
        {
          url: '/revamp/images/announcementBox/christmas-desktop-right.webp',
          revision: 'c2fc62b52c1eec55eddb2801779f3f04',
        },
        {
          url: '/revamp/images/announcementBox/christmas-mobile-left.webp',
          revision: '1b42ffaf213ac1e654565ed1b3e64c7b',
        },
        {
          url: '/revamp/images/announcementBox/christmas-mobile-right.webp',
          revision: '2ac258f4269d1b2f59c469f14c1e2aa8',
        },
        {
          url: '/revamp/images/announcementBox/cny-desktop-left.svg',
          revision: '62945b7f0b66fcff4378f71a2ad3fe36',
        },
        {
          url: '/revamp/images/announcementBox/cny-desktop-right.svg',
          revision: 'b3934dd989360e78ac99614b917f9c08',
        },
        {
          url: '/revamp/images/announcementBox/cny-mobile-left.svg',
          revision: 'f7b2cec1cffb353b9007ff5c6acac295',
        },
        {
          url: '/revamp/images/announcementBox/cny-mobile-right.svg',
          revision: '21daaccf9b0702cf0a19127a64b4faa8',
        },
        {
          url: '/revamp/images/announcementBox/custom-desktop-left.webp',
          revision: 'fdcc1c5bfd006b5f561d52e1fec9cc80',
        },
        {
          url: '/revamp/images/announcementBox/custom-desktop-right.webp',
          revision: '85c02f5922297e461b1e1651286f6df1',
        },
        {
          url: '/revamp/images/announcementBox/custom-mobile-right.webp',
          revision: '034b06449cdf7ec96403fb370a02f6c5',
        },
        {
          url: '/revamp/images/announcementBox/custom/custom-desktop-left.webp',
          revision: 'fdcc1c5bfd006b5f561d52e1fec9cc80',
        },
        {
          url: '/revamp/images/announcementBox/custom/custom-desktop-right.webp',
          revision: '0f9dfac9480cf54d52657cb98a469cd3',
        },
        {
          url: '/revamp/images/announcementBox/custom/custom-mobile-right.webp',
          revision: '27c5a374b305c5aef5f9909063b86875',
        },
        {
          url: '/revamp/images/announcementBox/idulfitri2023-desktop-left.svg',
          revision: '383ba8399a142cd71623baee224c6ce1',
        },
        {
          url: '/revamp/images/announcementBox/idulfitri2023-desktop-right.svg',
          revision: 'd6e8079b649f1f44126ae61e96486561',
        },
        {
          url: '/revamp/images/announcementBox/idulfitri2023-mobile-left.svg',
          revision: '9a49615731b07ef0eb08f200fae52d8b',
        },
        {
          url: '/revamp/images/announcementBox/idulfitri2023-mobile-right.svg',
          revision: 'cca540bbc4ee5d15e3975774f30bcade',
        },
        {
          url: '/revamp/images/announcementBox/newyear-desktop-left.webp',
          revision: 'db8cbf637f8ba5d4829fb5a92f719040',
        },
        {
          url: '/revamp/images/announcementBox/newyear-desktop-right.webp',
          revision: 'e940b26ef786a72880ad8491478a3a07',
        },
        {
          url: '/revamp/images/announcementBox/newyear-mobile-left.webp',
          revision: 'bde8b9e9de927a4f0fbd99dc81ed7f1b',
        },
        {
          url: '/revamp/images/announcementBox/newyear-mobile-right.webp',
          revision: 'ed126235d052b373fd503bbc4eaf41c3',
        },
        {
          url: '/revamp/images/announcementBox/ramadhan-desktop-left.svg',
          revision: 'e49ddd98ea44f1b1085edd6cfca3bbdc',
        },
        {
          url: '/revamp/images/announcementBox/ramadhan-desktop-right.svg',
          revision: '0c5078ff4d31736f9c04f1c45646a851',
        },
        {
          url: '/revamp/images/announcementBox/ramadhan-mobile-left.svg',
          revision: 'deda340cd5df679402e7b71fbfa4455a',
        },
        {
          url: '/revamp/images/announcementBox/ramadhan-mobile-right.svg',
          revision: '9b770a19de91ae0829dc0d9e5183de03',
        },
        {
          url: '/revamp/images/app-store.webp',
          revision: '8de8763d05e7b7af9605e62aeff2a76c',
        },
        {
          url: '/revamp/images/banner/adaOTOdiSEVABanner.png',
          revision: '776eeb2bb71459ed8824a2acdf908ef5',
        },
        {
          url: '/revamp/images/banner/promotional-banner-rounded.webp',
          revision: 'bc72d6dd150214e08331e898eb0bb07d',
        },
        {
          url: '/revamp/images/brandCar/BMW.png',
          revision: '7075274992768aaa8574df0a5ac9f66f',
        },
        {
          url: '/revamp/images/brandCar/Daihatsu.png',
          revision: '43cc8783e881ab28f365bdfa28fce93e',
        },
        {
          url: '/revamp/images/brandCar/Isuzu.png',
          revision: '493df90e28d93174ffb87225e9da26af',
        },
        {
          url: '/revamp/images/brandCar/Peugeot.png',
          revision: '8fe30031139c52624a586cf512387030',
        },
        {
          url: '/revamp/images/brandCar/Toyota.png',
          revision: '7cf1896ddbd655d9890ef00e2ac01275',
        },
        {
          url: '/revamp/images/card_promotion-banner.webp',
          revision: 'c6683ee51a846c25d27f8d4a575c5e1e',
        },
        {
          url: '/revamp/images/flagIndonesia.png',
          revision: '876ce13d6b21508aca4251998945b5b3',
        },
        {
          url: '/revamp/images/floating/FloatingIconNew.webp',
          revision: 'ddb0fb4a9d616f0e647b6f0f330f7dff',
        },
        {
          url: '/revamp/images/floating/IconExpand.png',
          revision: '83ec47a2b8204533274356e3ac7e72d1',
        },
        {
          url: '/revamp/images/floating/content.png',
          revision: '83ec47a2b8204533274356e3ac7e72d1',
        },
        {
          url: '/revamp/images/floating/selector.webp',
          revision: 'ddb0fb4a9d616f0e647b6f0f330f7dff',
        },
        {
          url: '/revamp/images/google-play.webp',
          revision: '911cab9fa05c00ff9937a974f9561138',
        },
        {
          url: '/revamp/images/ktp_promotion-banner.webp',
          revision: '391a822365e43aa8cd413239d3c4f397',
        },
        {
          url: '/revamp/images/loan/bgLoanDesktop.webp',
          revision: '6a2e623501a4ea1edde59fc171bf1bc4',
        },
        {
          url: '/revamp/images/loan/bgLoanMobile.webp',
          revision: '1913af6403de0140be85822150275780',
        },
        {
          url: '/revamp/images/logo/logo-oto.webp',
          revision: '17c72905e77816e06a0fcf58429ed4e0',
        },
        {
          url: '/revamp/images/logo/seva-header.png',
          revision: 'dc339737068c63361b88ddb836971355',
        },
        {
          url: '/revamp/images/logo/seva-header.svg',
          revision: '1aac959419ed23a010f016a13aef32c7',
        },
        {
          url: '/revamp/images/modal/CitySelectorBackgroundDesktop.svg',
          revision: '7bd086421098efcc127f2737a2e26cee',
        },
        {
          url: '/revamp/images/modal/CitySelectorBackgroundMobile.svg',
          revision: 'f2c96ce94e3389b97f238257dc9cf732',
        },
        {
          url: '/revamp/images/profile/app-store.webp',
          revision: '8de8763d05e7b7af9605e62aeff2a76c',
        },
        {
          url: '/revamp/images/profile/card_promotion-banner.webp',
          revision: 'c6683ee51a846c25d27f8d4a575c5e1e',
        },
        {
          url: '/revamp/images/profile/google-play.webp',
          revision: '911cab9fa05c00ff9937a974f9561138',
        },
        {
          url: '/revamp/images/profile/ktp_promotion-banner.webp',
          revision: '391a822365e43aa8cd413239d3c4f397',
        },
        {
          url: '/revamp/images/profile/profile_promotion-banner.webp',
          revision: 'e788e3c39dfadb394af696ad4f812d04',
        },
        {
          url: '/revamp/images/profile_promotion-banner.webp',
          revision: 'e788e3c39dfadb394af696ad4f812d04',
        },
        {
          url: '/revamp/images/refinancing/circle.webp',
          revision: '99f70be99f715cc7024c6a987fe10cd2',
        },
        {
          url: '/revamp/images/refinancing/model.webp',
          revision: '47f498dcd8673855497209be58f5a942',
        },
        {
          url: '/revamp/images/typeCar/HATCHBACK.png',
          revision: '7110b7ea6cb5624dd636f00f58ba33e7',
        },
        {
          url: '/revamp/images/typeCar/MPV.png',
          revision: '13ba7d60b648cac65451bdd1c91349aa',
        },
        {
          url: '/revamp/images/typeCar/SEDAN.png',
          revision: 'c2d52b67e91cb0e252adfa041d494900',
        },
        {
          url: '/revamp/images/typeCar/SPORT.png',
          revision: '22b58f2856f249e884a7abee4c90a31e',
        },
        {
          url: '/revamp/images/typeCar/SUV.png',
          revision: '319d502db2b5f23849bd4997e1450d76',
        },
        {
          url: '/revamp/svg/modal.svg',
          revision: 'f2c96ce94e3389b97f238257dc9cf732',
        },
        {
          url: '/revamp/vector/howToUse/blueRounded.png',
          revision: 'c8153c23c964fad07603e068fd12fafd',
        },
        {
          url: '/revamp/vector/howToUse/redRounded.png',
          revision: 'c1f8443062d7f22fb7c2efab9f58fed7',
        },
        { url: '/thirteen.svg', revision: '53f96b8290673ef9d2895908e69b2f92' },
        { url: '/vercel.svg', revision: '61c6b19abff40ea7acd577be818f3976' },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: a,
              event: i,
              state: r,
            }) =>
              a && 'opaqueredirect' === a.type
                ? new Response(a.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: a.headers,
                  })
                : a,
          },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        const a = e.pathname
        return !a.startsWith('/api/auth/') && !!a.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        return !e.pathname.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      'GET',
    )
})
