import { useState, useEffect } from "react";
import axios from "axios";
import "antd/dist/antd.css";
import { Button, Input } from "antd";
import { SearchOutlined, AntCloudOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { Card } from "antd";
function App() {
  const [todo, setTodo] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("london");
  const [weather, setWeather] = useState();
  const { Meta } = Card;
  async function getData() {
    setError(false);
    try {
      const reponse = await axios.get(
        "https://www.metaweather.com/api/location/search/?query=" + city
      );
      console.log("reponse :", reponse);
      if (reponse.data.length == 0) {
        setError(true);
      }
      const reponse2 = await axios.get(
        "https://www.metaweather.com/api/location/" + reponse.data[0].woeid
      );
      console.log(reponse2.data.consolidated_weather[0]);
      setWeather(reponse2.data.consolidated_weather);
      setLoading(false);
      console.log("Inside getdata");
    } catch (err) {
      console.log(err);
      console.log("erreur");
      setError(true);
    }
  }
  useEffect(() => {
    getData();
  }, [city]);
  return (
    <div>
      <Input
        size="large"
        placeholder="large size"
        prefix={<AntCloudOutlined />}
        style={{ width: "50%", marginRight: "2rem" }}
        onChange={(e) => {
          setTodo(e.target.value);
        }}
        value={todo}
      />
      <Button
        type="primary"
        icon={<SearchOutlined />}
        size="large"
        onClick={(e) => {
          e.preventDefault(); //meaning?
          setCity(todo);
        }}
      >
        Search
      </Button>
      {error ? (
        <div>city not valid</div>
      ) : (
        <>
          {loading ? (
            <div>
              <Spin size="large" />
            </div>
          ) : (
            <div style={{ display: "flex" }}>
              {weather.map((elem) => (
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="example"
                      src={`https://www.metaweather.com/static/img/weather/${elem.weather_state_abbr}.svg`}
                    />
                  }
                >
                  <Meta
                    title={elem.applicable_date}
                    description={elem.weather_state_name}
                  />
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default App;
