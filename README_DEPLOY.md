# Deploy Ko'rsatmalari

Ushbu loyiha ikki qismdan iborat: Frontend (Vercel) va Backend (Render).

## 1. Backend (Render.com)
1. GitHub-da yangi repozitoriya oching va loyihani yuklang.
2. [Render.com](https://render.com) saytiga kiring.
3. **New > Web Service** tanlang.
4. Repozitoriyangizni ulang.
5. **Root Directory**: `backend`
6. **Build Command**: `npm install`
7. **Start Command**: `npm start`
8. **Eslatma**: Ma'lumotlar `data.json` faylida saqlanadi. Render-da fayl tizimi vaqtinchalik bo'lgani uchun, har safar server o'chib yonganida (sleep yoki redeploy) ma'lumotlar asl holiga qaytadi.

## 2. Frontend (Vercel.com)
1. [Vercel.com](https://vercel.com) saytiga kiring.
2. **Add New > Project** tanlang.
3. Repozitoriyangizni ulang.
4. **Framework Preset**: `Vite`
5. **Root Directory**: `./` (loyihaning asosi)
6. **Environment Variables**:
   - `VITE_API_URL`: Render-dagi backend manzilingiz (masalan: `https://mutola-api.onrender.com/api`)
