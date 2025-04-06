import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaPiggyBank, FaMobileAlt, FaMagic, FaLightbulb } from "react-icons/fa";

export default function HomePage() {
  const navigate = useNavigate();

  return (
<div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 overflow-y-auto">
    <div className="flex flex-col items-center justify-center px-4 py-10 space-y-10 max-w-6xl mx-auto">
      
      <img
        src="../public/photos/logo2.png"
        alt="BudgetMate logó"
        className="h-48 mx-auto mb-4 drop-shadow-xl"
      />

      <div className="text-center space-y-10 animate-fade-in">
        <h1 className="text-5xl font-extrabold text-gray-900 drop-shadow">
          Üdvözöl a BudgetMate!
        </h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            A BudgetMate egy modern, letisztult pénzügyi alkalmazás, amely segít a kiadásaid és bevételeid rendszerezésében, pénzügyi céljaid elérésében és a tudatos megtakarításban.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-800">
            <div className="p-4 bg-white rounded-2xl shadow-lg hover:scale-105 transition-transform">
              <FaChartLine className="text-4xl mx-auto text-blue-500" />
              <h3 className="mt-4 font-semibold text-lg">Statisztikák</h3>
              <p className="text-sm">Könnyen értelmezhető grafikonok és elemzések segítik a pénzügyi áttekintést.</p>
            </div>
            <div className="p-4 bg-white rounded-2xl shadow-lg hover:scale-105 transition-transform">
              <FaPiggyBank className="text-4xl mx-auto text-green-500" />
              <h3 className="mt-4 font-semibold text-lg">Költségkeret</h3>
              <p className="text-sm">Állíts be havi vagy heti limiteket, és figyeld a megtakarításaidat.</p>
            </div>
            <div className="p-4 bg-white rounded-2xl shadow-lg hover:scale-105 transition-transform">
              <FaMobileAlt className="text-4xl mx-auto text-purple-500" />
              <h3 className="mt-4 font-semibold text-lg">Elérhető bárhol</h3>
              <p className="text-sm">Reszponzív design, hogy bármilyen eszközön használhasd az alkalmazást.</p>
            </div>
          </div>

          <div className="flex justify-center space-x-6 pt-4">
            <button
              onClick={() => navigate("/bejelentkezes")}
              className="px-6 py-3 rounded-2xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition shadow-lg"
            >
              Bejelentkezés
            </button>
            <button
              onClick={() => navigate("/regisztracio")}
              className="px-6 py-3 rounded-2xl bg-green-500 text-white font-semibold hover:bg-green-600 transition shadow-lg"
            >
              Regisztráció
            </button>
          </div>
        </div>

        <div className="mt-20 w-full space-y-16">
          <section className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Miért válaszd a BudgetMate-et?</h2>
            <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
              Mert segít pénzügyi céljaid elérésében, növeli a pénzügyi tudatosságodat és egyszerűsíti a kiadásaid és bevételeid nyomon követését.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <img
              src="public\photos\depositphotos_253625476-stock-photo-starting-his-own-business-rich.jpg"
              alt="Budgeting dashboard"
              className="rounded-2xl shadow-xl w-full h-auto"
            />
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800">Tiszta pénzügyi átláthatóság</h3>
              <p className="text-gray-700">
                Minden tranzakciódat rendszerezve és vizualizálva látod, így mindig pontos képet kapsz a pénzügyeidről.
              </p>
              <p className="text-gray-700">
                Nincs többé költekezés kontroll nélkül – állíts be értesítéseket, figyeld a kategóriákat, és hozd ki a legtöbbet a pénzedből!
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-2xl shadow-lg">
            <div className="space-y-4">
              <FaLightbulb className="text-4xl text-yellow-500" />
              <h3 className="text-2xl font-semibold text-gray-800">Tippek és trükkök</h3>
              <p className="text-gray-700">
                Használj költségvetési sablonokat, állíts be megtakarítási célokat, és tanulj a múltbéli szokásaidból.
              </p>
            </div>
            <div className="space-y-4">
              <FaMagic className="text-4xl text-pink-500" />
              <h3 className="text-2xl font-semibold text-gray-800">Automatizált varázslat</h3>
              <p className="text-gray-700">
                Az alkalmazás automatikusan kategorizálja a kiadásaidat, értesít, ha túlköltekezel, és vizualizálja a pénzügyi jövődet.
              </p>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Kezdd el még ma!</h2>
            <p className="mt-4 text-gray-700 max-w-xl mx-auto">
              Csatlakozz még ma a BudgetMate közösséghez, és tedd meg az első lépést a pénzügyi szabadság felé!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
