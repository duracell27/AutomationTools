import axios from "axios";
import { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from "react-responsive-carousel";
import toast from "react-hot-toast";
import Carousel from "react-bootstrap/Carousel";

const Mercedes = () => {
  const [data, setData] = useState("");
  const [input, setInput] = useState("");

  let partNumber = "";
  let replaces = "";
  let position = "";
  let description = "";
  let tableRows = [];
  let mas = [];
  let unicFromMas = [];
  let title = "";
  let compabilityObj = {};
  let replacesVariants = "";
  let images = [];

  // useEffect(() => {
  //   handleGetInfo();
  // }, []);

  const handleGetInfo = () => {
    axios
      .get(input)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  if (data !== "") {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(data, "text/html");

    partNumber = htmlDoc?.getElementsByClassName("list-value sku-display")[0]
      ?.innerText;
    replaces = htmlDoc?.getElementsByClassName("product-superseded-list")[0]
      ?.childNodes[3]?.innerText;
    position =
      htmlDoc?.getElementsByClassName("positions")[0]?.childNodes[3]?.innerText;

    title = htmlDoc?.getElementsByClassName("product-title")[0]?.innerText;
    title = title?.split("(")[0];

    description = htmlDoc?.getElementsByClassName(
      "list-value description_body"
    )[0]?.childNodes[0]?.innerText;

    tableRows = htmlDoc?.querySelectorAll(".fitment-row");

    for (var i = 0; i < tableRows.length; i++) {
      mas[i] = [];
      let k = 0;
      for (var j = 0; j < tableRows[i].childNodes.length; j++) {
        if (tableRows[i].childNodes[j].innerText) {
          mas[i][k] = tableRows[i].childNodes[j].innerText;
          k++;
        }
      }
    }

    mas.filter((row) => {
      if (!unicFromMas.includes(row[2])) {
        unicFromMas.push(row[2]);
      }
    });

    mas.sort(); // від цього залежить функція sortYears
    unicFromMas.map((unicModel) => {
      let yearsArr = [];
      mas.forEach((row) => {
        if (unicModel === row[2]) {
          yearsArr.push(Number(row[0].trim()));
        }
      });
      compabilityObj[unicModel] = sortYears(yearsArr);
    });
    if (replaces?.length > 0) {
      replacesVariants = generateVariationsForReplaces(replaces, partNumber);
    }

    let ul = htmlDoc?.querySelectorAll(".secondary-images");
    ul[0].childNodes.forEach((li) => {
      if (li.childNodes.length > 0) {
        images.push(`https:${li.childNodes[1].attributes[4].value}`);
      }
    });

    compabilityObj = Object.keys(compabilityObj)
      .sort()
      .reduce((accumulator, key) => {
        accumulator[key] = compabilityObj[key];

        return accumulator;
      }, {});

    // console.log("obj", compabilityObj);
  }
  // ця функція приймає масив років, і сортує їх в послідовності по типу 2008-2012
  function sortYears(array) {
    if (array.length === 0) return "";

    let ranges = [];
    let start = array[0];
    let end = array[0];

    for (let i = 1; i < array.length; i++) {
      if (array[i] - array[i - 1] === 1) {
        end = array[i];
      } else {
        if (start !== end) {
          ranges.push(`${start}-${end}`);
        } else {
          ranges.push(start.toString());
        }
        start = array[i];
        end = array[i];
      }
    }

    if (start !== end) {
      ranges.push(`${start}-${end}`);
    } else {
      ranges.push(start.toString());
    }

    return ranges.join(",");
  }
  function generateVariationsForReplaces(inputString, mainPartNumber) {
    let elements = inputString.split(", ");
    elements.unshift(mainPartNumber);
    let variations = [];

    elements.forEach((element) => {
      let strippedElement = element.replace(/-/g, ""); // варіація 1
      let spacedElement = element.replace(/-/g, " "); // варіація 2

      variations.push(strippedElement); // варіація 1
      variations.push(spacedElement); // варіація 2
      variations.push(element); // варіація 3

      variations.push("A" + strippedElement); // варіація 4
      variations.push("A" + spacedElement); // варіація 5
      variations.push("A" + element); // варіація 6
    });

    return variations.join(", ");
  }
  return (
    <div className="mercedes">
      <div className="search_input_wrapper">
        <input
          type="text"
          value={input}
          placeholder="Вставте посилання з сайту"
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleGetInfo}>Отримати дані</button>
        <button onClick={()=>setInput('')}>Очистити</button>
      </div>

      <div className="main_info">
        <div className="main_info_leftside">
          <div className="main_info_item">
            <p>
              <strong>Part number:</strong>
            </p>
            <div className="main_info_item_value">
              {partNumber?.length > 0 ? (
                <span>{partNumber}</span>
              ) : (
                <span>Не вказано</span>
              )}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(partNumber);
                  toast.success("Part number copied");
                }}
              >
                copy
              </button>
            </div>
            {partNumber?.length > 0 ? (
              <div className="main_info_item_value">
                <span>{`A${partNumber.replace(/-/g, "")}`}</span>{" "}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `A${partNumber.replace(/-/g, "")}`
                    );
                    toast.success("Part A number copied");
                  }}
                >
                  copy
                </button>
              </div>
            ) : null}
          </div>
          <div className="main_info_item">
            <p>
              <strong>Name:</strong>
            </p>
            <div className="main_info_item_value">
              {title?.length > 0 ? (
                <span>{title}</span>
              ) : (
                <span>Не вказано</span>
              )}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(title);
                  toast.success("Name copied");
                }}
              >
                copy
              </button>
            </div>
          </div>
          <div className="main_info_item">
            <p>
              <strong>Description:</strong>
            </p>
            <div className="main_info_item_value">
              {description?.length > 0 ? (
                <span>{description}</span>
              ) : (
                <span>Не вказано</span>
              )}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(description);
                  toast.success("Description copied");
                }}
              >
                copy
              </button>
            </div>
          </div>
          <div className="main_info_item">
            <p>
              <strong>Position:</strong>
            </p>
            <div className="main_info_item_value">
              {position?.length > 0 ? (
                <span>{position}</span>
              ) : (
                <span>Не вказано</span>
              )}

              <button
                onClick={() => {
                  navigator.clipboard.writeText(description);
                  toast.success("Position copied");
                }}
              >
                copy
              </button>
            </div>
          </div>
        </div>
        <div className="main_info_rightside">
          <div className="carouselWrapper">
            {images.length > 0 ? (
              <Carousel interval={null}>
                {images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <div className="carouselIMG">
                      <img src={image} alt="img" />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              // <Carousel dynamicHeight>
              //   {images.map((image, index) => (
              //     <div key={index}>
              //       <img src={image} />
              //     </div>
              //   ))}
              // </Carousel>
              "Тут будуть картинки"
            )}
          </div>
        </div>
      </div>
      <div className="main_info_item">
        <p>
          <strong>Replaces:</strong>
        </p>
        <div className="main_info_item_value">
          {replacesVariants?.length > 0 ? (
            <span>{replacesVariants}</span>
          ) : (
            <span>Не вказано</span>
          )}
          <button
            onClick={() => {
              navigator.clipboard.writeText(replacesVariants);
              toast.success("Replaces copied");
            }}
          >
            copy
          </button>
        </div>
      </div>
      <div className="tableData">
        <div className="main_info_item">
          <p>
            <strong>Compatibility</strong>
          </p>
          <div className="main_info_item_value flex-col">
            {Object.keys(compabilityObj).length > 0 ? (
              Object.keys(compabilityObj).map((keyName, index) => (
                <div key={index}>
                  <span>
                    <strong>{keyName}</strong>
                  </span>
                  {" : "}
                  <span>{compabilityObj[keyName]}</span>
                </div>
              ))
            ) : (
              <p>Немає даних</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mercedes;
