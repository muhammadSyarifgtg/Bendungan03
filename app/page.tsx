'use client'
import supabase from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Howl } from 'howler';

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const beepSound = new Howl({
    src: ["/sounds/beep.mp3"], 
    volume: 0.3, 
    loop: true, 
  });

  async function fetchData() {
    const { data: fetchedData } = await supabase
      .from("bendungans")
      .select("*")
      .order("id", { ascending: false })
      .limit(1);
    setData(fetchedData ?? []);
  }

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const getLampuColor = (ketinggian: any) => {
    const adjustedKetinggian = 20 - ketinggian; // Adjust the ketinggian
    if (adjustedKetinggian <= 10) {
      beepSound.play();
      return 'red'; 
    } else if (adjustedKetinggian <= 15) {
      beepSound.stop();
      return 'yellow'; 
    } else {
      beepSound.stop();
      return 'green'; 
    }
  };

  const getLampuKeterangan = (ketinggian: any) => {
    const adjustedKetinggian = 20 - ketinggian; // Adjust the ketinggian
    if (adjustedKetinggian <= 10) {
      beepSound.play();
      return 'Awas';
    } else if (adjustedKetinggian <= 15) {
      beepSound.stop();
      return 'Waspada';
    } else {
      beepSound.stop();
      return 'Aman';
    }
  };

  const getRainKeterangan = (hujan: any) => {
    return hujan === 0 ? "Hujan" : "Tidak Hujan";
  };

  return (
    <>
      <div>
        {data.map((item, index) => {
          const adjustedJarak = 20 - item.jarak; // Adjust the jarak
          return (
            <div key={index}>
              <div className="flex flex-col mx-10 my-10">
                <div className="flex flex-col justify-center items-center p-6">
                  <p className="text-4xl font-semibold uppercase tracking-widest text-white">Smart Dam</p>
                </div>
                <div className="lg:grid lg:grid-cols-4 gap-4 m-4">
                  <div className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 mb-4">
                    <p className="mb-2">Ketinggian Air</p>
                    <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                    <p className="text-4xl">{adjustedJarak} <span className="text-base">cm</span></p>
                  </div>
                  <div className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 mb-4">
                    <p className="mb-2">Indikator Bahaya</p>
                    <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <p className="font-bold">{getLampuKeterangan(item.jarak)}</p>
                      </div>
                      <div className="flex items-center justify-end">
                        <div
                          className={`lampu ${getLampuColor(item.jarak)}`}
                        >
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 mb-4">
                    <p className="mb-2">Indikator Hujan</p>
                    <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-4xl">{item.hujan}</p>
                      </div>
                      <div>
                        <p>{getRainKeterangan(item.hujan)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 mb-4">
                    <p className="mb-2">Suhu Sekitar</p>
                    <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p>Suhu</p>
                        <p>{item.suhu}</p>
                      </div>
                      <div>
                        <p>Kelembaban</p>
                        <p>{item.kelembaban}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  );
}
