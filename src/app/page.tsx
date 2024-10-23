"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';

type Make = {
  MakeId: number;
  MakeName: string;
};

export default function Home() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [years, setYears] = useState<number[]>([]);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const apiURL = process.env.NEXT_PUBLIC_API_URL_VECHICLES_TYPE;

  // Fetch vehicle makes
  useEffect(() => {
    async function fetchMakes() {
      const res = await fetch(`${apiURL}`);
      const data = await res.json();
      setMakes(data.Results);
    }

    fetchMakes();

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: currentYear - 2014 }, (_, i) => 2015 + i);
    setYears(yearOptions);
  }, []);

  useEffect(() => {
    setIsButtonEnabled(!!selectedMake && !!selectedYear);
  }, [selectedMake, selectedYear]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">Select Vehicle Make and Model Year</h1>

      <div className="w-full max-w-md mb-6">
        <select
          value={selectedMake}
          onChange={(e) => setSelectedMake(e.target.value)}
          className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Vehicle Make</option>
          {makes.map((make) => (
            <option key={make.MakeId} value={make.MakeId}>
              {make.MakeName}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full max-w-md mb-6">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Model Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <Link href={`/result/${selectedMake}/${selectedYear}`}>
        <button
          className={`w-44 max-w-44 p-3 bg-blue-500 text-white rounded-md transition duration-300 ${isButtonEnabled ? 'hover:bg-blue-600 cursor-pointer' : 'cursor-not-allowed opacity-50'
            }`}
          disabled={!isButtonEnabled}
        >
          Next
        </button>
      </Link>
    </div>
  );
}
