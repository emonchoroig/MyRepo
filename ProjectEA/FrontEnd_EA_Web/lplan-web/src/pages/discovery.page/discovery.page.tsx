import React, { useEffect } from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import { useTranslation } from "react-i18next";

// Fondo de pantalla personalizado ...
import backgroundImage from "../../assets/images/background_4.jpg";
import { User } from "../../models/user.model";
import { UserService } from "../../services/user.service";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import _debounce from "lodash/debounce";
import "./discovery.page.css";
import { AuthService } from "../../services/auth.service";
import { Link, useNavigate } from "react-router-dom";

const Discovery = () => {
	const [userList, setUserList] = useState<User[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const navigate = useNavigate();
	const { t } = useTranslation();

	useEffect(() => {
		document.body.style.backgroundImage = `url(${backgroundImage})`;
		UserService.getUsers()
			.then((response) => {
				setUserList(response.data);
			})
			.catch((error) => {
				navigate("*");
			});

		const audioDescription = AuthService.getAudioDescription();
		// Leer el texto del usuario actual en voz alta al cargar la página
		if (audioDescription === "si") {
			const pageToSpeech = "You are in discovery";
			speakText(pageToSpeech);
		}
	}, []);

	// Función para leer el texto en voz alta
	const speakText = (text: string) => {
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = "en";
		window.speechSynthesis.speak(utterance);
	};

	const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value;
		if (query.length > 0) {
			try {
				const response = await UserService.searchUsers(query);
				setUserList(response.data);
			} catch (error) {
				console.error(error);
			}
		} else {
			try {
				const response = await UserService.getUsers();
				setUserList(response.data);
			} catch (error) {
				console.error(error);
			}
		}
	};

	const debouncedSearch = _debounce(handleSearch, 500);

	const currentUser = AuthService.getCurrentUser();

	return (
		<div>
			<Navbar />
			<div className="titleContainer">
				<h1 className="titleSection">{t("Discovery")}</h1>
				<input
					type="text"
					placeholder="Search Users"
					value={searchQuery}
					onChange={(event) => {
						setSearchQuery(event.target.value);
						debouncedSearch(event);
					}}
				/>
			</div>
			<div className="cardsUsers">
				{userList.length > 0 ? (
					<ul>
						{userList.map((user: User) => (
							<li key={user.uuid}>
								{currentUser === user.uuid ? (
									<Link to={"/profile"} className="user-link">
										<div className="user">
											{user.photoUser ? (
												<img
													src={user.photoUser}
													alt={user.nameUser}
													className="user__profile-img"
												/>
											) : (
												<img
													src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
													alt="profile-img"
													className="profile-img-card"
												/>
											)}
											<div className="user__info">
												<p className="user__name">
													{user.nameUser} {user.surnameUser}
												</p>
												<p className="user__username">@{user.appUser}</p>
											</div>
										</div>
									</Link>
								) : (
									<Link to={`/user/${user.uuid}`} className="user-link">
										<div className="user">
											{user.photoUser ? (
												<img
													src={user.photoUser}
													alt={user.nameUser}
													className="user__profile-img"
												/>
											) : (
												<img
													src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
													alt="profile-img"
													className="profile-img-card"
												/>
											)}
											<div className="user__info">
												<p className="user__name">
													{user.nameUser} {user.surnameUser}
												</p>
												<p className="user__username">@{user.appUser}</p>
											</div>
										</div>
									</Link>
								)}
							</li>
						))}
					</ul>
				) : (
					<h1 className="usersnotfound">{t("UNF")}</h1>
				)}
			</div>
			<Footer />
		</div>
	);
};

export default Discovery;
