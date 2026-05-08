import { useEffect, useState } from "react"
import Papa from "papaparse"

const App = () => {
const [pasien, setPasien] = useState([])
const [pasienCetak, setPasienCetak] = useState(null)

const hitungDass42 = (jawaban) => {
const depresi = [3, 5, 10, 13, 16, 17, 21, 24, 26, 31, 34, 37, 38, 42]
const kecemasan = [2, 4, 7, 9, 15, 19, 20, 23, 25, 28, 30, 36, 40, 41]
const stres = [1, 6, 8, 11, 12, 14, 18, 22, 27, 29, 32, 33, 35, 39]

const hitungTotal = (kategori) => {
  return kategori.reduce((total, nomor) => {
    const kunci = Object.keys(jawaban).find(k => k.startsWith(nomor + "."))
    return total + (kunci ? parseInt(jawaban[kunci]) || 0 : 0)
  }, 0)
}

const skorDepresi = hitungTotal(depresi)
const skorKecemasan = hitungTotal(kecemasan)
const skorStres = hitungTotal(stres)

const tentukanTingkat = (skor, bNormal, bRingan, bSedang, bParah) => {
  if (skor <= bNormal) return "Normal"
  if (skor <= bRingan) return "Ringan"
  if (skor <= bSedang) return "Sedang"
  if (skor <= bParah) return "Parah"
  return "Sangat Parah"
}

return {
  depresi: tentukanTingkat(skorDepresi, 9, 13, 20, 27),
  skorDepresi: skorDepresi,
  kecemasan: tentukanTingkat(skorKecemasan, 7, 9, 14, 19),
  skorKecemasan: skorKecemasan,
  stres: tentukanTingkat(skorStres, 14, 18, 25, 33),
  skorStres: skorStres
}
}

useEffect(() => {
const urlCsv = "https://docs.google.com/spreadsheets/d/1ZdZxEpDcvbzZCTY0mIKges9xsso5J_GrR-04nxg1Hl0/export?format=csv"
const tarikData = () => {
Papa.parse(urlCsv, {
download: true,
header: true,
complete: (hasil) => {
const dataTerhitung = hasil.data.map((baris) => ({
nama: baris["Nama Peserta :"],
umur: baris["Umur :"],
perusahaan: baris["Perusahaan :"],
hasil: hitungDass42(baris)
}))
setPasien(dataTerhitung.filter((p) => p.nama))
}
})
}
tarikData()
const interval = setInterval(tarikData, 5000)
return () => clearInterval(interval)
}, [])

const buatKesimpulan = (hasil) => {
return Pasien memiliki tingkat depresi ${hasil.depresi.toLowerCase()}, tingkat kecemasan ${hasil.kecemasan.toLowerCase()}, dan tingkat stres ${hasil.stres.toLowerCase()}.
}

const getWarnaTeks = (tingkat) => {
if (tingkat === "Normal") return "text-green-600"
if (tingkat === "Ringan") return "text-yellow-500"
if (tingkat === "Sedang") return "text-orange-500"
if (tingkat === "Parah") return "text-red-600"
return "text-purple-700"
}

if (pasienCetak) {
return (


<button onClick={() => setPasienCetak(null)} className="px-6 py-2 bg-gray-500 text-white rounded font-bold">Kembali
<button onClick={() => window.print()} className="px-6 py-2 bg-blue-900 text-white rounded font-bold">Cetak Dokumen

    <div className="max-w-3xl mx-auto flex-grow w-full relative">
      <div className="absolute top-0 right-0 w-48">
        <img src="/logo-maxima.jpeg" alt="Logo Maxima" className="w-full h-auto" />
      </div>

      <div className="mb-8 pt-4">
        <h1 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Hasil Skoring DASS-42</h1>
        <p className="text-lg font-bold text-gray-700">Maxima Laboratorium Klinik</p>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-md mb-2 text-left uppercase border-l-4 border-blue-900 pl-2">Data Peserta</h3>
        <div className="grid grid-cols-[180px_10px_1fr] gap-1 text-md text-left font-medium">
          <div>Nama Peserta</div><div>:</div><div>{pasienCetak.nama}</div>
          <div>Umur</div><div>:</div><div>{pasienCetak.umur || "-"}</div>
          <div>Perusahaan</div><div>:</div><div>{pasienCetak.perusahaan || "-"}</div>
        </div>
      </div>
      
      <hr className="border-black border-t-2 my-4" />

      <div className="mb-6">
        <h3 className="font-bold text-md mb-2 text-left uppercase border-l-4 border-blue-900 pl-2">Scoring</h3>
        <div className="grid grid-cols-[180px_10px_1fr] gap-1 text-md text-left font-medium">
          <div>Skala Depresi</div><div>:</div><div>{pasienCetak.hasil.skorDepresi} ({pasienCetak.hasil.depresi})</div>
          <div>Skala Kecemasan</div><div>:</div><div>{pasienCetak.hasil.skorKecemasan} ({pasienCetak.hasil.kecemasan})</div>
          <div>Skala Stress</div><div>:</div><div>{pasienCetak.hasil.skorStres} ({pasienCetak.hasil.stres})</div>
        </div>
      </div>

      <div className="mb-6 border-2 border-blue-900 p-4 text-left bg-blue-50/30">
        <p className="font-bold mb-1 text-sm text-blue-900 uppercase">Kesimpulan :</p>
        <p className="text-sm font-medium">{buatKesimpulan(pasienCetak.hasil)}</p>
      </div>
    </div>
    <div className="mt-8 text-center text-[10px] font-bold text-blue-900/40 uppercase">Ar Development Team</div>
  </div>
)
}

return (




Hasil Skoring DASS-42
Maxima Laboratorium Klinik

    <div className="overflow-hidden bg-white rounded-xl shadow-2xl border border-blue-100">
      <table className="min-w-full text-left border-collapse">
        <thead className="bg-blue-900 text-white">
          <tr>
            <th className="p-4 font-bold uppercase text-sm">Nama Pasien</th>
            <th className="p-4 font-bold uppercase text-sm text-center">Depresi</th>
            <th className="p-4 font-bold uppercase text-sm text-center">Kecemasan</th>
            <th className="p-4 font-bold uppercase text-sm text-center">Stres</th>
            <th className="p-4 font-bold uppercase text-sm text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pasien.map((p, i) => (
            <tr key={i} className="hover:bg-blue-50 transition-colors border-b border-gray-100">
              <td className="p-4 font-bold text-blue-950">{p.nama}</td>
              <td className={"p-4 text-center uppercase text-xs font-black " + getWarnaTeks(p.hasil.depresi)}>{p.hasil.depresi}</td>
              <td className={"p-4 text-center uppercase text-xs font-black " + getWarnaTeks(p.hasil.kecemasan)}>{p.hasil.kecemasan}</td>
              <td className={"p-4 text-center uppercase text-xs font-black " + getWarnaTeks(p.hasil.stres)}>{p.hasil.stres}</td>
              <td className="p-4 text-center">
                <button onClick={() => setPasienCetak(p)} className="px-4 py-1 bg-blue-900 text-white rounded font-bold text-xs uppercase hover:bg-blue-800">Cetak</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-8 text-center text-[10px] font-bold text-blue-900/40 uppercase">Ar Development Team</div>
  </div>
</div>
)
}

export default App