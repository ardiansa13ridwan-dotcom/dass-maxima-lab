import { useEffect, useState } from "react"
import Papa from "papaparse"

const App = () => {
  const [pasien, setPasien] = useState<any[]>([])
  const [pasienCetak, setPasienCetak] = useState<any | null>(null)
  const [kataKunci, setKataKunci] = useState("")
  // State baru untuk mode rekapan
  const [isRekapanMode, setIsRekapanMode] = useState(false)

  const hitungDass42 = (jawaban: any) => {
    const depresi = [3, 5, 10, 13, 16, 17, 21, 24, 26, 31, 34, 37, 38, 42]
    const kecemasan = [2, 4, 7, 9, 15, 19, 20, 23, 25, 28, 30, 36, 40, 41]
    const stres = [1, 6, 8, 11, 12, 14, 18, 22, 27, 29, 32, 33, 35, 39]

    const hitungTotal = (kategori: number[]) => {
      return kategori.reduce((total, nomor) => {
        const kunci = Object.keys(jawaban).find(k => k.startsWith(nomor + "."))
        return total + (kunci ? parseInt(jawaban[kunci]) || 0 : 0)
      }, 0)
    }

    const skorDepresi = hitungTotal(depresi)
    const skorKecemasan = hitungTotal(kecemasan)
    const skorStres = hitungTotal(stres)

    const tentukanTingkat = (skor: number, bNormal: number, bRingan: number, bSedang: number, bParah: number) => {
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
        complete: (hasil: any) => {
          const dataTerhitung = hasil.data.map((baris: any) => ({
            nama: baris["Nama Peserta :"],
            umur: baris["Umur :"],
            perusahaan: baris["Perusahaan :"],
            hasil: hitungDass42(baris)
          }))
          setPasien(dataTerhitung.filter((p: any) => p.nama))
        }
      })
    }
    tarikData()
    const interval = setInterval(tarikData, 5000)
    return () => clearInterval(interval)
  }, [])

  const buatKesimpulan = (hasil: any) => {
    return `Pasien memiliki tingkat depresi ${hasil.depresi.toLowerCase()}, tingkat kecemasan ${hasil.kecemasan.toLowerCase()}, dan tingkat stres ${hasil.stres.toLowerCase()}.`
  }

  const getWarnaTeks = (tingkat: string) => {
    if (tingkat === "Normal") return "text-green-600"
    if (tingkat === "Ringan") return "text-yellow-500"
    if (tingkat === "Sedang") return "text-orange-500"
    if (tingkat === "Parah") return "text-red-600"
    return "text-purple-700"
  }

  // Tampilan 1: Mode Cetak Individu (Tidak berubah)
  if (pasienCetak) {
    return (
      <div className="bg-white p-8 print:p-0 text-black font-sans min-h-screen flex flex-col justify-between" style={{ WebkitPrintColorAdjust: 'exact' }}>
        <div className="max-w-3xl mx-auto w-full relative">
          <div className="print:hidden mb-8 flex gap-4">
            <button onClick={() => setPasienCetak(null)} className="px-6 py-2 bg-gray-500 text-white rounded font-bold hover:bg-gray-600">Kembali</button>
            <button onClick={() => window.print()} className="px-6 py-2 bg-blue-900 text-white rounded font-bold hover:bg-blue-800">Cetak Dokumen</button>
          </div>
          
          <div className="relative">
            <div className="absolute top-0 right-0 w-48">
              <img src="/logo-maxima.jpeg" alt="Logo Maxima" className="w-full h-auto" onError={(e) => { e.currentTarget.style.display = 'none';}}/>
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
                <div>Skala Depresi</div><div>:</div><div className={"font-bold " + getWarnaTeks(pasienCetak.hasil.depresi)}>{pasienCetak.hasil.skorDepresi} ({pasienCetak.hasil.depresi})</div>
                <div>Skala Kecemasan</div><div>:</div><div className={"font-bold " + getWarnaTeks(pasienCetak.hasil.kecemasan)}>{pasienCetak.hasil.skorKecemasan} ({pasienCetak.hasil.kecemasan})</div>
                <div>Skala Stress</div><div>:</div><div className={"font-bold " + getWarnaTeks(pasienCetak.hasil.stres)}>{pasienCetak.hasil.skorStres} ({pasienCetak.hasil.stres})</div>
              </div>
            </div>

            <div className="mb-6 border-2 border-blue-900 p-4 text-left bg-blue-50/30">
              <p className="font-bold mb-1 text-sm text-blue-900 uppercase">Kesimpulan :</p>
              <p className="text-sm font-medium">{buatKesimpulan(pasienCetak.hasil)}</p>
            </div>
          </div>
        </div>
        
        <div className="text-center pb-4">
            <p className="text-[10px] font-bold text-blue-900/40 uppercase tracking-widest">Ar Development Team</p>
        </div>
      </div>
    )
  }

  // Tampilan 2: Tampilan Cetak Rekapan Seluruh Pasien (BARU)
  if (isRekapanMode) {
    return (
      <div className="bg-white p-8 print:p-0 text-black font-sans min-h-screen flex flex-col justify-between" style={{ WebkitPrintColorAdjust: 'exact' }}>
        <div className="max-w-7xl mx-auto w-full relative">
          <div className="print:hidden mb-8 flex gap-4">
            <button onClick={() => setIsRekapanMode(false)} className="px-6 py-2 bg-gray-500 text-white rounded font-bold hover:bg-gray-600">Kembali</button>
            <button onClick={() => window.print()} className="px-6 py-2 bg-blue-900 text-white rounded font-bold hover:bg-blue-800">Cetak Laporan Rekapan</button>
          </div>

          <div className="relative border-b-2 border-black pb-4 mb-6">
            <div className="absolute top-0 right-0 w-32">
              <img src="/logo-maxima.jpeg" alt="Logo Maxima" className="w-full h-auto" onError={(e) => { e.currentTarget.style.display = 'none';}}/>
            </div>

            <div className="pt-2">
              <h1 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Rekapitulasi Hasil Skoring DASS-42</h1>
              <p className="text-lg font-bold text-gray-700">Maxima Laboratorium Klinik</p>
              <p className="text-xs text-gray-500 mt-1">Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          {/* Tabel Rekapan */}
          <div className="overflow-hidden border border-gray-400 rounded">
            <table className="min-w-full text-xs text-left border-collapse">
              <thead className="bg-blue-900 text-white shadow-[inset_0_0_0_999px_rgba(30,58,138,1)] print:shadow-[inset_0_0_0_999px_rgba(30,58,138,1)]">
                <tr>
                  <th className="border border-gray-400 p-2 font-bold uppercase text-white text-center">No.</th>
                  <th className="border border-gray-400 p-2 font-bold uppercase text-white">Nama Pasien</th>
                  <th className="border border-gray-400 p-2 font-bold uppercase text-white text-center">Umur</th>
                  <th className="border border-gray-400 p-2 font-bold uppercase text-white">Perusahaan</th>
                  <th className="border border-gray-400 p-2 font-bold uppercase text-white text-center">Depresi</th>
                  <th className="border border-gray-400 p-2 font-bold uppercase text-white text-center">Kecemasan</th>
                  <th className="border border-gray-400 p-2 font-bold uppercase text-white text-center">Stres</th>
                </tr>
              </thead>
              <tbody>
                {pasien.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors border-b border-gray-400">
                    <td className="border border-gray-400 p-2 text-center text-gray-700">{i + 1}.</td>
                    <td className="border border-gray-400 p-2 font-bold text-blue-950">{p.nama}</td>
                    <td className="border border-gray-400 p-2 text-center">{p.umur || "-"}</td>
                    <td className="border border-gray-400 p-2">{p.perusahaan || "-"}</td>
                    <td className={"border border-gray-400 p-2 text-center uppercase text-[10px] font-black " + getWarnaTeks(p.hasil.depresi)}>{p.hasil.depresi}</td>
                    <td className={"border border-gray-400 p-2 text-center uppercase text-[10px] font-black " + getWarnaTeks(p.hasil.kecemasan)}>{p.hasil.kecemasan}</td>
                    <td className={"border border-gray-400 p-2 text-center uppercase text-[10px] font-black " + getWarnaTeks(p.hasil.stres)}>{p.hasil.stres}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="text-center pb-4 mt-8">
            <p className="text-[10px] font-bold text-blue-900/40 uppercase tracking-widest">Ar Development Team</p>
        </div>
      </div>
    )
  }

  // Filter pencarian pasien (Tidak berubah)
  const pasienDifilter = pasien.filter((p) => p.nama.toLowerCase().includes(kataKunci.toLowerCase()))

  // Tampilan 3: Halaman Utama (Ditambahkan Tombol Rekapan)
  return (
    <div className="min-h-screen bg-blue-50 p-8 text-blue-900 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b-4 border-blue-900 pb-4">
          <div className="text-left">
            <h1 className="text-3xl font-extrabold uppercase tracking-tighter">Hasil Skoring DASS-42</h1>
            <p className="text-xl font-bold text-blue-800">Maxima Laboratorium Klinik</p>
          </div>
          <div className="w-40 bg-white p-2 rounded shadow-sm">
            <img src="/logo-maxima.jpeg" alt="Logo Maxima" className="w-full h-auto" onError={(e) => { e.currentTarget.style.display = 'none';}}/>
          </div>
        </div>
        
        {/* Panel Kontrol Atas (Pencarian & BARU: Tombol Rekapan) */}
        <div className="mb-6 grid grid-cols-[1fr_auto] gap-4 items-center">
          <input 
            type="text" 
            placeholder="Cari nama pasien di sini..." 
            className="w-full p-4 rounded-xl border-2 border-blue-200 outline-none focus:border-blue-900 text-blue-900 font-bold shadow-sm"
            value={kataKunci}
            onChange={(e) => setKataKunci(e.target.value)}
          />
          {/* Tombol Rekapan BARU */}
          <button 
            onClick={() => setIsRekapanMode(true)}
            className="px-6 py-4 bg-blue-900 text-white rounded-xl font-bold uppercase text-sm hover:bg-blue-800 shadow-lg shadow-blue-900/10 active:scale-95 transition-transform"
          >
            Cetak Rekapan Seluruh Pasien
          </button>
        </div>

        <div className="overflow-hidden bg-white rounded-xl shadow-2xl border border-blue-100">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-blue-900 text-white shadow-[inset_0_0_0_999px_rgba(30,58,138,1)]">
              <tr>
                <th className="p-4 font-bold uppercase text-sm">Nama Pasien</th>
                <th className="p-4 font-bold uppercase text-sm text-center">Depresi</th>
                <th className="p-4 font-bold uppercase text-sm text-center">Kecemasan</th>
                <th className="p-4 font-bold uppercase text-sm text-center">Stres</th>
                <th className="p-4 font-bold uppercase text-sm text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pasienDifilter.map((p, i) => (
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
              {pasienDifilter.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center font-bold text-gray-400">Tidak ada pasien dengan nama tersebut</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-[10px] font-bold text-blue-900/40 uppercase tracking-widest">Ar Development Team</p>
        </div>
      </div>
    </div>
  )
}

export default App