import './App.css';
import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/Fade';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';

function App() {
  const [quoteData, setQuote] = useState();
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(1);
  const [index2, setIndex2] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [open, setOpen] = useState(true);
  const api_url ='https://famous-quotes4.p.rapidapi.com/random?category=all&count=200';

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.unsplash.com/photos?query=architecture&per_page=200&client_id=_x2-jPUZWgK-csZfpW9DStciZQ0N-tNzkaSyhuzSMSo');
      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }
      const data = await response.json();
      setPhotos(data);
      console.log(data);
      localStorage.setItem('images', JSON.stringify(data));
      localStorage.setItem('index2', 0);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  async function getapi(url)
  {
    await setLoading(true)
    const response = await fetch(url, 
      {
        headers: {
          'X-RapidAPI-Key': 'e014bd923cmshee287b35414686cp1e586bjsn25c44b4afc10',
          'X-RapidAPI-Host': 'famous-quotes4.p.rapidapi.com'
        }
      });
    var data = await response.json();
    setQuote(data);
    localStorage.setItem('quotes', JSON.stringify(data));
    localStorage.setItem('index', 0);
    console.log(data);
    await setLoading(false);
  }

  function handleClick(){
    setOpen(false);
    setTimeout(()=>{
      setIndex(prevIndex => prevIndex + 1);
      localStorage.setItem('index', index);
      setIndex2(prevIndex => prevIndex + 1);
      localStorage.setItem('index2', index2);

      const storedQuotes = localStorage.getItem('quotes');
      let storedIndex = localStorage.getItem('index');
      const storedImages = localStorage.getItem('images');
      let storedIndex2 = localStorage.getItem('index2');
      storedIndex = parseInt(storedIndex, 10);
      storedIndex2 = parseInt(storedIndex2, 10);

      if (!storedImages || storedIndex2 >= 30) {
        fetchData()
      }
      if (!storedQuotes || storedIndex >= 200) {
        getapi(api_url);
      }
      setOpen(true)
    }, 200);
  }

  useEffect(() => {
    const storedQuotes = localStorage.getItem('quotes');
    let storedIndex = localStorage.getItem('index');
    const storedImages = localStorage.getItem('images');
    let storedIndex2 = localStorage.getItem('index2');
    storedIndex = parseInt(storedIndex, 10);
    storedIndex2 = parseInt(storedIndex2, 10);

    if (!storedImages || storedIndex2 >= 30) {
      fetchData()
    } else {
      const parsedQuotes = JSON.parse(storedImages);
      setPhotos(parsedQuotes);
      setIndex2(storedIndex2);
    }
    if (!storedQuotes || storedIndex >= 100) {
      getapi(api_url);
    } else {
      const parsedQuotes = JSON.parse(storedQuotes);
      setQuote(parsedQuotes);
      setIndex(storedIndex);
    }
  }, []);

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 cont'>
      <Fade in={open}>
      <div className='quote-cont d-flex justify-content-center align-items-center'>
          <div className='quote-txt-cont'>
              <h1 className='quote-txt'>{quoteData && quoteData[index] ? quoteData[index]['text'] : "Hello"}</h1>
              <h3 className='quote-txt'>{quoteData && quoteData[index] ? `- ${quoteData[index]['author']}` : "- Author"}</h3>
          </div>
        <Button 
          variant="primary Dark"
          data-bs-theme="dark"
          disabled={loading}
          onClick={!loading ? handleClick : null}
        >
          {loading? "Loading":"Generate Quote"}
        </Button>
      </div>
      </Fade>
      <Fade in={open}>
        <img className='quote-img' src={(photos[index2] && photos) && photos[index2].urls.regular} alt={(photos[index2] && photos) && photos[index2].alt_description} />
      </Fade>
      <div className='dark-overlay'></div>
    </div>
  );
}

export default App;
