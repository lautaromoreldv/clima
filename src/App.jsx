import React, { useState } from "react";
import { Container, Typography, Grid, TextField, IconButton, InputAdornment, Button, Stack, Card, CardContent, CardMedia, List, ListItem, ListItemText, Divider, Alert, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';
import GoogleMapReact from "google-map-react";
import Loader from "./Loader";

function App() {

	const [hayClima, setHayClima] = useState(false);
	const [coord, setCoord] = useState();
	const [temp, setTemp] = useState();
	const [weather, setWeather] = useState();
	const [wind, setWind] = useState();
	const [nombre, setNombre] = useState("");

	const [buscar, setBuscar] = useState("");
	const [error, setError] = useState(false);
	const [cargando, setCargando] = useState(false);

	const url = 'https://api.openweathermap.org/data/2.5/weather?q=';
	const API_KEY = 'd247f4e74ef95cf541c3bb882d1fa708';

	const traerClima = async() => {
		if(buscar.trim() == ''){
			return
		}
		setCargando(true)
		const valor = buscar;
		const response = await fetch(url + valor + '&appid=' + API_KEY + '&units=metric&lang=es');
		const res = await response.json();
		setBuscar("")
		if(response.status == 200){
			setHayClima(true);
			setCoord(res.coord);
			setTemp(res.main)
			setWeather(res.weather[0])
			setWind(res.wind)
			setNombre(res.name)
			setError(false)
		} else if(response.status == 404){
			setError("No se encontró esa ubicación.")
			setHayClima(false)
		} else{
			setError("Ocurrió un problema al buscar esa ubicacion.")
			setHayClima(false)
		}
		setTimeout(() => {
			setCargando(false);
		}, 300)
	}

	const API_KEY_MAPS = 'AIzaSyDjiLbyZpoyoUwICJOpUh6nBtOq3lwMYtw';
	const AnyReactComponent = ({ text }) => <div>{text}</div>;

    return (
      	<>
		<Box id="nav">
			<Typography component='h1' variant="h2" id="titulo" sx={{mb:4, textAlign:'center', color:'#fff'}}>
				Buscador de clima
			</Typography>
			<Box id="box">
				<Container>
					<TextField 
						label="¿De dónde querés saber el clima?"
						fullWidth
						type="text"
						autoComplete="off"
						onChange={(e) => setBuscar(e.target.value)}
						value={buscar}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
								),
								endAdornment: buscar && (
									<IconButton onClick={() => setBuscar("")}>
										<CloseIcon />
									</IconButton>
								)
						}}
					/> 
					<Stack direction='column' sx={{mt: 2}} >
						<Button variant="contained" disabled={!buscar} onClick={() => traerClima()}>
							Buscar
						</Button>
					</Stack>
				</Container>
			</Box>
		</Box>
		<Container>
			{cargando ? (
				<div className="loader"><Loader /></div>
			) : hayClima ? (
				<Grid container spacing={2} sx={{mt:2}} >
					<Grid item xs={12} sm={6} className="gridItem">
						<Card className="card">
							<CardContent>
								<Typography variant="h3" component='p' id="nombreCardContent">
									{nombre}
								</Typography>
								<Typography variant="h4" component='p' id="clima">
									{temp.temp.toFixed(1)} C°
								</Typography>
							</CardContent>
							<CardMedia 
								component='img'
								image={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
								alt={weather.description}
								sx={{ height:100, width: 'auto' }}
							/>
							<Typography variant="h5" component='p'>
								{weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
							</Typography>
						</Card>
					</Grid>
					<Grid item xs={12} sm={6} className="gridItem">
						<Card className="card">
							<CardContent id="cardContent">
								<List>
									<ListItem disablePadding className="listItem">
										<ListItemText primary='Temperaturas' />
									</ListItem>
									<Divider />
									<ListItem disablePadding className="listItem">
										<ListItemText primary={`Máxima ↑ ${temp.temp_max.toFixed(1)} C°`} 
										primaryTypographyProps={{
											color:"#dc3545"
										}} />
										<ListItemText primary="/" />
										<ListItemText primary={`Mínima ${temp.temp_min.toFixed(1)} C° ↓`} primaryTypographyProps={{
											color:"#007bff"
										}}  />
									</ListItem>
									<Divider />
									<ListItem disablePadding className="listItem">
										<ListItemText primary={`Humedad: ${temp.humidity}%`} />
									</ListItem>
									<Divider />
									<ListItem disablePadding className="listItem">
										<ListItemText primary={`Presión: ${temp.pressure} hPA`} />
									</ListItem>
									<Divider />
									<ListItem disablePadding className="listItem">
										<ListItemText primary={`Viento: ${(wind.speed * 3.6).toFixed(1)} km/h`} />
									</ListItem>
								</List>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sx={{mt:2, mb: 4}}>
						<div style={{ height: '600px', width: '100%' }}>
							<GoogleMapReact
								bootstrapURLKeys={{ key: API_KEY_MAPS}}
								center={{lat: coord?.lat, lng: coord?.lon}}
								defaultZoom={13}
							>
								<AnyReactComponent
									lat={coord?.lat}
									lng={coord?.lon}
									text={nombre}
								/>
							</GoogleMapReact>
						</div>
					</Grid>
				</Grid>
				) : error ? (
					<Alert severity="error" sx={{mt:4}}>{error}</Alert>
				)
			: ''
			}
		</Container>
      </>
    )
}

export default App
