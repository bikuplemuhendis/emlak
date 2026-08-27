# Atelier Gayrimenkul

Tek ofisli, çok kiracılı olmayan bir emlak ilan ve yönetim sitesi. Houzez benzeri genel vitrin (başlık, arama, kart, filtre, tip bazlı ilan şablonları) ve ajanın ilan / ayar / talep paneli içerir. WordPress veya hazır tema kullanılmaz.

## Çalıştırma

```bash
npm install
cp .env.example .env.local
npm run dev
```

Tarayıcı: [http://localhost:3000](http://localhost:3000)

Üretim derlemesi:

```bash
npm run build
npm start
```

## Demo yönetim girişi

- Adres: `/admin`
- Şifre: `atelier2026` (veya `.env.local` içinde `ADMIN_PASSWORD`)

Oturum httpOnly çerezle tutulur. Tek kullanıcı / tek ofis; ajans pazaryeri veya faturalama yoktur.

## Ne var?

**Genel site (Türkçe arayüz)**

- Anasayfa: sinema boy kahraman arama, öne çıkan ilanlar, mülk tipleri ve sayıları, istatistik, yorum, CTA, son ilanlar
- `/ilanlar`: ızgara / liste / stilize harita, kenar çubuğu ve mobil çekmece filtreleri, sıralama, sayfalama
- `/ilanlar/[slug]`: galeri, fiyatlama (kiralıkta depozito, satılıkta kredi notu), tip şablonu, özellikler, danışman, talep formu, benzer ilanlar
- `/hakkimizda`, `/iletisim`, `/ofis`
- Yapışkan başlık, telefon / WhatsApp, mobil hamburger menü

**Tipe göre şablonlar**

- Daire: oda+salon, kat, bina yaşı, ısınma, eşya, balkon, aidat, banyo, kat planı
- Villa / müstakil: bahçe m², havuz, kat, otopark, manzara, dış cephe
- Arsa: imar, m², ada/parsel, KAKS, tapu, altyapı, yol cephesi (yatak/banyo yok)
- Ofis / ticari: net-brüt m², kat, bina, uygun kullanım, aidat, otopark
- Kartlar da uyarlanır: arsada m² + imar, konutta oda/banyo

**Özelleştirme (SaaS değil, ofis ayarları)**

`/admin/ayarlar` ile kaydedilir (`data/settings.json`): ajans adı, logo damgası, renkler (CSS değişkeni), hero, bölüm açık/kapalı, varsayılan ızgara/liste, şeffaf veya dolu başlık, alt bilgi, danışman kartı. Yenilemede kalır; genel site okur.

**Yönetim**

- Özet sayaçları ve son talepler
- İlan CRUD (çoklu görsel URL, tip/durum’a göre alanlar)
- Talepler (iletişim, ilan, ofis, bülten)
- 12 örnek ilan: İstanbul, Ankara, İzmir, Muğla, Bursa

Veri dosyaları: `data/properties.json`, `data/settings.json`, `data/inquiries.json` (ilk okumada örnek veriden üretilir).

## Rotalar

`/`, `/ilanlar`, `/ilanlar/[slug]`, `/hakkimizda`, `/iletisim`, `/ofis`, `/admin`, `/admin/ilanlar`, `/admin/ilanlar/yeni`, `/admin/ilanlar/[id]`, `/admin/ayarlar`, `/admin/talepler`
