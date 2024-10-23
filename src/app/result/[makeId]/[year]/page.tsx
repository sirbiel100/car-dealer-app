import { Suspense } from 'react';

type Model = {
  Model_ID: number;
  Model_Name: string;
};

async function getVehicleModels(makeId: string, year: string) {
  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (!data || !data.Results) {
      throw new Error('Invalid response format');
    }

    return data;
  } catch (error) {
    console.error('Error fetching vehicle models:', error);
    return { Results: [] };
  }
}

export default async function ResultPage({ params }: { params: { makeId: string; year: string } }) {
  const { makeId, year } = params;
  const data = await getVehicleModels(makeId, year);
  const models: Model[] = data.Results;

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">Vehicle Models for {year}</h1>

      <Suspense fallback={<div className="text-center text-gray-500">Loading models...</div>}>
        <ul className="space-y-4">
          {models.length > 0 ? (
            models.map((model) => (
              <li
                key={model.Model_ID}
                className="p-4 bg-white rounded-md shadow-md hover:bg-gray-50 transition duration-300"
              >
                {model.Model_Name}
              </li>
            ))
          ) : (
            <li className="text-center text-gray-500">No models found for this make and year.</li>
          )}
        </ul>
      </Suspense>
    </div>
  );
}

export async function generateStaticParams() {
  const res = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json');
  const data = await res.json();
  const makes = data.Results;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2014 }, (_, i) => 2015 + i);

  const paths = makes.flatMap((make: { MakeId: number }) =>
    years.map((year) => ({
      makeId: String(make.MakeId),
      year: String(year),
    }))
  );

  return paths;
}