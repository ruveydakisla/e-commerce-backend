# 📦 Microservices E-Ticaret Platformu

Bu proje, mikroservis mimarisi ile geliştirilen bir e-ticaret sistemidir. NestJS ile yazılmıştır ve servisler arası iletişim Kafka ile sağlanmaktadır. Projede TCP tabanlı API Gateway ile mikroservisler arasında yönlendirme yapılmaktadır.

## 🧩 Mikroservisler

* **Auth**: Kimlik doğrulama işlemleri (JWT, register, login)
* **Users**: Kullanıcı yönetimi
* **Products**: Ürün listeleme, arama (Elasticsearch), stok sorgulama
* **Orders**: Sipariş oluşturma ve takibi (Kafka event fırlatır)
* **Cart**: Kullanıcı sepet yönetimi
* **Notification**: Sipariş bildirimleri (e-mail, push vs.)
* **Shipping**: Kargo bilgisi oluşturur (dummy veri)
* **Stock**: Ürün stoklarını günceller

Her mikroservis kendi veritabanına sahiptir (MongoDB veya PostgreSQL).

## 📡 Servisler Arası İletişim

* **Kafka**: Event-driven mimari. Örneğin, `order_created` eventi orders servisinden yayınlanır.
* **Redis**: Cacheleme (products servisi)
* **Elasticsearch**: Ürün araması için (products servisi)
* **API Gateway**: Tüm istekler buradan geçer, mikroservislerle **TCP protokolü** üzerinden iletişim kurar.

## ⚙️ Kurulum

### 1. Monorepo Bağımlılıkları Kurun

```bash
npm install
```

### 2. Her Mikroservisin İçine Girip Bağımlılıkları Kurun

```bash
cd apps/auth && npm install
cd ../users && npm install
# Diğer servislerde tekrarlayın
```

### 3. Ortam Değişkenlerini Ayarlayın

Her mikroservisin kök dizinine `.env` dosyası oluşturun:

```env
PORT=3001
JWT_SECRET=secretKey
KAFKA_BROKER=localhost:9092
DATABASE_URL=postgres://user:pass@localhost:5432/db_name
REDIS_HOST=localhost
```

### 4. Mikroservisleri Başlatın

Her mikroservisi ayrı terminalde çalıştırabilirsiniz:

```bash
cd apps/auth
npm run start:dev
```

Alternatif olarak Docker Compose ile:

```bash
docker-compose up --build
```

## 🚀 Event Driven Yapı

* `orders` servisi sipariş oluşturunca `order_created` eventini yayınlar.
* `notification`, `stock` ve `shipping` servisleri bu eventi dinler:

  * **notification** → Kullanıcıya bildirim gönderir
  * **stock** → İlgili ürünün stok miktarını azaltır
  * **shipping** → Dummy kargo bilgisi oluşturur

## 🔐 Güvenlik

* `JwtAuthGuard`: JWT ile kimlik doğrulama
* `RolesGuard`: Kullanıcı rolleri (admin, user)
* `OwnerGuard`: Kaynağa yalnızca sahibi erişebilir
* `Global Exception Filter`: Merkezi hata yönetimi

## 🧪 Test

```bash
npm run test         # Birim test
npm run test:e2e     # End-to-End test
```

## 📬 API Örnekleri

```http
POST /auth/login                      # Giriş
POST /orders                         # Sipariş oluştur
GET /products/search?q=telefon       # Ürün arama (Elasticsearch)
GET /cart/:userId                    # Sepeti görüntüle
```

## 🛰️ Teknolojiler

* **NestJS** (Monorepo)
* **Kafka** (Event Streaming)
* **Redis** (Cache)
* **Elasticsearch** (Search)
* **PostgreSQL & MongoDB** (Veritabanları)
* **Docker / Docker Compose** (Ortam Yönetimi)

## 🧠 Ek Notlar

* API Gateway tüm servislerle TCP üzerinden konuşur.
* Her servis bağımsız geliştirilebilir ve dağıtılabilir.
* Elasticsearch ve Redis sadece `products` servisinde kullanılıyor.

## ✍️ Geliştiren

Ruveyda Kışla
[GitHub](https://github.com/ruveydakisla) • [LinkedIn](https://linkedin.com/in/ruveydakisla)
