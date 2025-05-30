import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import { fetchAndTransformUsers, UserTransform } from "@/services/users";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface Data {
  type: "Vegetable" | "Fruit";
  name: string;
}

export default function Home() {
  const rawData: Data[] = [
    {
      type: "Fruit",
      name: "Apple",
    },
    {
      type: "Vegetable",
      name: "Broccoli",
    },
    {
      type: "Vegetable",
      name: "Mushroom",
    },
    {
      type: "Fruit",
      name: "Banana",
    },
    {
      type: "Vegetable",
      name: "Tomato",
    },
    {
      type: "Fruit",
      name: "Orange",
    },
    {
      type: "Fruit",
      name: "Mango",
    },
    {
      type: "Fruit",
      name: "Pineapple",
    },
    {
      type: "Vegetable",
      name: "Cucumber",
    },
    {
      type: "Fruit",
      name: "Watermelon",
    },
    {
      type: "Vegetable",
      name: "Carrot",
    },
  ];

  const [dataList, setDataList] = useState<Data[]>(rawData);
  const [fruitList, setFruitList] = useState<Data[]>([]);
  const [vegetableList, setVegetableList] = useState<Data[]>([]);
  const [users, setUsers] = useState<UserTransform | []>([]);

  const setDataByType = (data: Data) => {
    if (data.type === "Fruit") {
      setFruitList((prevState) => [...prevState, data]);
    } else {
      setVegetableList((prevState) => [...prevState, data]);
    }

    setDataList(dataList.filter((lData) => lData.name != data.name));

    setTimeout(() => {
      setDataList((prev) => [...prev, data]);
      if (data.type === "Fruit") {
        setFruitList((prev) => prev.filter((fData) => fData.name !== data.name));
      } else {
        setVegetableList((prev) => prev.filter((vData) => vData.name !== data.name));
      }
    }, 5000);
  };

  const setDataToList = (data: Data, index: number) => {
    setDataList((prevState) => [...prevState, data]);
    if (data.type === "Fruit") {
      setFruitList(fruitList.filter((_, fIndex) => fIndex != index));
    } else {
      setVegetableList(vegetableList.filter((_, vIndex) => vIndex != index));
    }
  };

  useEffect(() => {
    fetchAndTransformUsers().then((res) => {
      if (!!res) {
        setUsers(res);
      }
    });
  }, []);

  console.log(users);

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-[family-name:var(--font-geist-sans)] min-h-screen flex items-center justify-center p-4`}
    >
      <div className="bg-white rounded shadow-lg flex w-full max-w-5xl p-6 gap-4 min-h-[720px]">
        <div className="flex flex-col space-y-2 w-1/4">
          {dataList.map((data, index) => (
            <button
              key={index}
              className="border px-4 py-2 rounded hover:bg-gray-100"
              onClick={() => {
                setDataByType(data);
              }}
            >
              {data.name}
            </button>
          ))}
        </div>

        <div className="flex flex-1 space-x-4">
          <div
            className="flex-1 border rounded p-2"
            onClick={() => {
              if (fruitList.length > 0) {
                setDataToList(
                  fruitList[fruitList.length - 1],
                  fruitList.length - 1
                );
              }
            }}
          >
            <h2 className="font-semibold border-b pb-2 mb-2 text-center">
              Fruit
            </h2>
            <div className="flex flex-col space-y-2 w-full">
              {fruitList.map((fruit, index) => (
                <button
                  key={index}
                  className="border px-4 py-2 rounded hover:bg-gray-100"
                  onClick={(event) => {
                    event.stopPropagation();
                    setDataToList(fruit, index);
                  }}
                >
                  {fruit.name}
                </button>
              ))}
            </div>
          </div>
          <div
            className="flex-1 border rounded p-2"
            onClick={() => {
              if (vegetableList.length > 0) {
                setDataToList(
                  vegetableList[vegetableList.length - 1],
                  vegetableList.length - 1
                );
              }
            }}
          >
            <h2 className="font-semibold border-b pb-2 mb-2 text-center">
              Vegetable
            </h2>
            <div className="flex flex-col space-y-2 w-full">
              {vegetableList.map((vegetable, index) => (
                <button
                  key={index}
                  className="border px-4 py-2 rounded hover:bg-gray-100"
                  onClick={(event) => {
                    event.stopPropagation();
                    setDataToList(vegetable, index);
                  }}
                >
                  {vegetable.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
