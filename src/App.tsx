import { useEffect, useState } from "react"
import Papa from "papaparse"

const App = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pasien, setPasien] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pasienCetak, setPasienCetak] = useState<any | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        complete: (hasil: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dataTerhitung = hasil.data.map((baris: any) => ({
            nama: baris["Nama Peserta :"],
            umur: baris["Umur :"],
            perusahaan: baris["Perusahaan :"],
            hasil: hitungDass42(baris)
          }))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setPasien(dataTerhitung.filter((p: any) => p.nama))
        }
      })
    }

    tarikData()
    const interval = setInterval(tarikData, 5000)

    return () => clearInterval(interval)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buatKesimpulan = (hasil: any) => {
    return `Pasien mengalami tingkat depresi ${hasil.depresi.toLowerCase()}, tingkat kecemasan ${hasil.kecemasan.toLowerCase()}, dan tingkat stres ${hasil.stres.toLowerCase()}.`
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tanganiCetak = (p: any) => {
    setPasienCetak(p)
  }

  if (pasienCetak) {
    return (
      <div className="bg-white p-8 print:p-0 text-black font-sans min-h-screen print:min-h-0 flex flex-col">
        <div className="print:hidden mb-8 flex gap-4">
          <button onClick={() => setPasienCetak(null)} className="px-6 py-2 bg-gray-500 text-white rounded font-bold hover:bg-gray-600 transition-colors">
            Kembali
          </button>
          <button onClick={() => window.print()} className="px-6 py-2 bg-blue-900 text-white rounded font-bold hover:bg-blue-800 transition-colors">
            Cetak Dokumen
          </button>
        </div>
        
        <div className="max-w-3xl mx-auto flex-grow w-full">
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2 text-left">Data Peserta</h3>
            <div className="grid grid-cols-[180px_10px_1fr] gap-1 text-lg text-left font-medium">
              <div>Nama Peserta</div><div>:</div><div>{pasienCetak.nama}</div>
              <div>Umur</div><div>:</div><div>{pasienCetak.umur || "-"}</div>
              <div>Perusahaan</div><div>:</div><div>{pasienCetak.perusahaan || "-"}</div>
            </div>
          </div>
          
          <hr className="border-black border-t-2 my-4" />

          <div className="mb-6">
            <h3 className="font-bold text-lg mb-2 text-left">Scoring</h3>
            <div className="grid grid-cols-[180px_10px_1fr] gap-2 text-lg text-left font-medium">
              <div>Skala Depresi</div><div>:</div><div>{pasienCetak.hasil.skorDepresi} ({pasienCetak.hasil.depresi})</div>
              <div>Skala Kecemasan</div><div>:</div><div>{pasienCetak.hasil.skorKecemasan} ({pasienCetak.hasil.kecemasan})</div>
              <div>Skala Stress</div><div>:</div><div>{pasienCetak.hasil.skorStres} ({pasienCetak.hasil.stres})</div>
            </div>
          </div>

          <div className="mb-4 text-left">
            <h3 className="font-bold text-lg mb-2">Indikator Penilaian</h3>
            <table className="w-full border-collapse border border-black text-center text-md">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-black p-2">Tingkat</th>
                  <th className="border border-black p-2">Depresi</th>
                  <th className="border border-black p-2">Kecemasan</th>
                  <th className="border border-black p-2">Stress</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2">Normal</td>
                  <td className="border border-black p-2">0 - 9</td>
                  <td className="border border-black p-2">0 - 7</td>
                  <td className="border border-black p-2">0 - 14</td>
                </tr>
                <tr>
                  <td className="border border-black p-2">Ringan</td>
                  <td className="border border-black p-2">10 - 13</td>
                  <td className="border border-black p-2">8 - 9</td>
                  <td className="border border-black p-2">15 - 18</td>
                </tr>
                <tr>
                  <td className="border border-black p-2">Sedang</td>
                  <td className="border border-black p-2">14 - 20</td>
                  <td className="border border-black p-2">10 - 14</td>
                  <td className="border border-black p-2">19 - 25</td>
                </tr>
                <tr>
                  <td className="border border-black p-2">Parah</td>
                  <td className="border border-black p-2">21 - 27</td>
                  <td className="border border-black p-2">15 - 19</td>
                  <td className="border border-black p-2">26 - 33</td>
                </tr>
                <tr>
                  <td className="border border-black p-2">Sangat parah</td>
                  <td className="border border-black p-2">&gt; 28</td>
                  <td className="border border-black p-2">&gt; 20</td>
                  <td className="border border-black p-2">&gt; 34</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-4 border border-black p-4 text-left">
            <p className="font-bold mb-1 text-md">Kesimpulan :</p>
            <p className="text-md">{buatKesimpulan(pasienCetak.hasil)}</p>
          </div>

          <div className="text-left text-xs italic mb-6 text-gray-600">
            <p>Reference:</p>
            <p>Lovibond, S.H. & Lovibond, P.F. (1995). Manual for the Depression Anxiety Stress Scales (2nd. Ed.). Sydney: Psychology Foundation.</p>
          </div>

          <div className="flex justify-end mb-4">
            <div className="text-center w-64">
              <p className="mb-16 text-lg">Mengetahui,</p>
              <p className="font-bold border-b border-black pb-1 inline-block text-lg"></p>
              <p className="mt-1 text-lg"></p>
            </div>
          </div>
        </div>

        <div className="mt-2 text-center text-sm text-gray-400">
          Dibuat oleh Ar Development Team
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 p-8 text-blue-900 font-sans flex flex-col">
      <div className="max-w-7xl mx-auto flex-grow w-full">
        <h1 className="text-3xl font-bold mb-8 text-center uppercase tracking-wider">
          Hasil Skoring DASS-42<br/>
          <span className="text-xl font-medium">Maxima Laboratorium Klinik</span>
        </h1>
        
        <div className="overflow-hidden bg-white rounded-lg shadow border border-gray-200">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="p-4 border-b-2 border-blue-900 font-semibold">Nama Pasien</th>
                <th className="p-4 border-b-2 border-blue-900 font-semibold text-center">Depresi</th>
                <th className="p-4 border-b-2 border-blue-900 font-semibold text-center">Kecemasan</th>
                <th className="p-4 border-b-2 border-blue-900 font-semibold text-center">Stres</th>
                <th className="p-4 border-b-2 border-blue-900 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pasien.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                    Menunggu data pasien masuk...
                  </td>
                </tr>
              ) : (
                pasien.map((p, indeks) => (
                  <tr key={indeks} className="hover:bg-blue-100 transition-colors duration-150">
                    <td className="p-4 border-b border-gray-200 font-medium">{p.nama}</td>
                    <td className="p-4 border-b border-gray-200 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${p.hasil.depresi === 'Normal' ? 'bg-green-100 text-green-800' : p.hasil.depresi === 'Sangat Parah' ? 'bg-red-200 text-red-900' : 'bg-yellow-100 text-yellow-800'}`}>
                        {p.hasil.depresi}
                      </span>
                    </td>
                    <td className="p-4 border-b border-gray-200 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${p.hasil.kecemasan === 'Normal' ? 'bg-green-100 text-green-800' : p.hasil.kecemasan === 'Sangat Parah' ? 'bg-red-200 text-red-900' : 'bg-yellow-100 text-yellow-800'}`}>
                        {p.hasil.kecemasan}
                      </span>
                    </td>
                    <td className="p-4 border-b border-gray-200 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${p.hasil.stres === 'Normal' ? 'bg-green-100 text-green-800' : p.hasil.stres === 'Sangat Parah' ? 'bg-red-200 text-red-900' : 'bg-yellow-100 text-yellow-800'}`}>
                        {p.hasil.stres}
                      </span>
                    </td>
                    <td className="p-4 border-b border-gray-200 text-center">
                      <button onClick={() => tanganiCetak(p)} className="px-4 py-1 bg-blue-900 text-white rounded font-medium hover:bg-blue-800 transition-colors">
                        Cetak
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-12 text-center text-sm font-medium text-blue-900/60">
        Dibuat oleh Ar Development Team
      </div>
    </div>
  )
}

export default App