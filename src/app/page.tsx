import { ArrowRight, Calendar, Shield, Users, CheckCircle, Clock, CreditCard, Instagram, Twitter } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/global/Header'

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<Header />

			{/* Hero Section */}
			<section className="relative mx-auto max-w-7xl overflow-hidden px-6 py-20">
				<div className="absolute inset-0 z-0">
					<img
						src="/images/forest-runner.jpg"
						alt="Coureur sur sentier forestier"
						className="h-full w-full object-cover opacity-30"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-gray-900/40 to-gray-900/30"></div>
				</div>
				<div className="relative z-10 grid items-center gap-12 lg:grid-cols-2">
					<div>
						<h1 className="mb-6 text-5xl font-bold">
							Un imprévu ?<br /> Transfert ton dossard !
						</h1>
						<p className="mb-8 text-xl leading-relaxed text-gray-300">
							Que vous soyez plutôt running, trail, triathlon ou encore cyclisme
							<br />
							Trouvez votre course favorite ou vendez votre dossard en toute confiance.
						</p>
						<div className="flex space-x-4">
							<Link href="/marketplace">
								<Button size="lg" className="bg-blue-600 hover:bg-blue-700">
									Consulter les courses
									<ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</Link>
							<Link href="/contact">
								<Button size="lg" className="bg-blue-600 hover:bg-blue-700">
									Organisateur ? Liste ta course
								</Button>
							</Link>
						</div>
					</div>
					<div className="relative">
						<div className="rotate-3 transform rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 p-8">
							<div className="-rotate-3 transform rounded-lg bg-white p-6 text-gray-900">
								<div className="mb-4 flex items-center justify-between">
									<span className="font-semibold">Marathon de Paris 2024</span>
									<span className="rounded bg-green-100 px-2 py-1 text-sm text-green-800">Disponible</span>
								</div>
								<div className="mb-2 text-2xl font-bold text-blue-600">€85</div>
								<div className="text-sm text-gray-600">Prix original: €120</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="bg-gray-800 py-16">
				<div className="mx-auto max-w-7xl px-6">
					<div className="grid gap-8 text-center md:grid-cols-3">
						<div>
							<div className="mb-2 text-4xl font-bold text-blue-400">2,500+</div>
							<div className="text-gray-300">Dossards vendus</div>
						</div>
						<div>
							<div className="mb-2 text-4xl font-bold text-blue-400">150+</div>
							<div className="text-gray-300">Courses partenaires</div>
						</div>
						<div>
							<div className="mb-2 text-4xl font-bold text-blue-400">98%</div>
							<div className="text-gray-300">Taux de satisfaction</div>
						</div>
					</div>
				</div>
			</section>

			{/* How it Works Section */}
			<section className="relative mx-auto max-w-7xl overflow-hidden px-6 py-20">
				<div className="absolute inset-0 z-0">
					<img
						src="/images/marathon-runners-bibs.jpg"
						alt="Coureurs avec dossards en course"
						className="h-full w-full object-cover opacity-10"
					/>
					<div className="absolute inset-0 bg-gray-900/60"></div>
				</div>
				<div className="relative z-10">
					<div className="mb-16 text-center">
						<h2 className="mb-6 text-4xl font-bold">Pourquoi choisir BibUp ?</h2>
						<p className="mx-auto max-w-3xl text-xl text-gray-300">
							Des avantages concrets pour chaque acteur de l'écosystème running
						</p>
					</div>

					<div className="mb-16 grid h-[800px] grid-cols-1 gap-6 lg:grid-cols-4 lg:grid-rows-3">
						{/* Organisateurs - Grande carte à gauche */}
						<Card className="relative overflow-hidden border-gray-500 bg-gradient-to-br from-gray-600 to-gray-800 lg:col-span-2 lg:row-span-3">
							<div className="absolute inset-0 bg-gradient-to-br from-gray-600/20 to-transparent"></div>
							<CardHeader className="relative z-10">
								<Calendar className="mb-6 h-16 w-16 text-white" />
								<CardTitle className="mb-4 text-3xl text-white">Organisateurs</CardTitle>
								<CardDescription className="text-lg text-blue-100">Sécurité, simplicité et croissance</CardDescription>
							</CardHeader>
							<CardContent className="relative z-10 space-y-6 text-white">
								<div>
									<h4 className="mb-3 text-lg font-semibold text-white">🛡️ Sécurité & Conformité</h4>
									<ul className="space-y-2">
										<li>• Couverture réglementaire et juridique complète</li>
										<li>• Réduction des fraudes et faux dossards</li>
										<li>• Traçabilité totale des transferts</li>
										<li>• Aucun flux financier à gérer</li>
									</ul>
								</div>
								<div>
									<h4 className="mb-3 text-lg font-semibold text-white">⚡ Simplicité Opérationnelle</h4>
									<ul className="space-y-2">
										<li>• Aucune charge technique</li>
										<li>• Centralisation des demandes de transfert</li>
										<li>• Réduction drastique des emails/SAV</li>
									</ul>
								</div>
								<div>
									<h4 className="mb-3 text-lg font-semibold text-white">📈 Visibilité & Croissance</h4>
									<ul className="space-y-2">
										<li>• Effet communautaire : trafic vers votre course</li>
										<li>• Nouvelles inscriptions indirectes</li>
										<li>• Découverte par de nouveaux participants</li>
										<li>• Réduisez drastiquement le nombre de non-partants</li>
										<li>• Moins de gaspillages aux ravitailements</li>
									</ul>
								</div>
							</CardContent>
						</Card>

						{/* Acheteurs - Carte en haut à droite */}
						<Card className="relative overflow-hidden border-gray-700 bg-gray-800 lg:col-span-2 lg:row-span-2">
							<div className="absolute inset-0 bg-gradient-to-br from-gray-600/20 to-transparent"></div>
							<div className="absolute top-4 right-4">
								<div className="flex space-x-2">
									<div className="h-3 w-3 rounded-full bg-green-400"></div>
									<div className="h-3 w-3 rounded-full bg-blue-400"></div>
									<div className="h-3 w-3 rounded-full bg-yellow-400"></div>
								</div>
							</div>
							<CardHeader>
								<Users className="mb-4 h-12 w-12 text-white" />
								<CardTitle className="text-2xl text-white">Acheteurs</CardTitle>
								<CardDescription className="text-gray-300">Confiance et simplicité d'achat</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4 text-gray-300">
								<div>
									<h4 className="mb-2 font-semibold text-white">🔒 Confiance & Transparence</h4>
									<ul className="space-y-1 text-sm">
										<li>• Profils vendeurs vérifiés</li>
										<li>• Aucun risque de faux dossard</li>
										<li>• Nouveau dossard à votre nom</li>
										<li>• Assurance garantie le jour J</li>
									</ul>
								</div>
								<div>
									<h4 className="mb-2 font-semibold text-white">🎯 Simplicité & Confort</h4>
									<ul className="space-y-1 text-sm">
										<li>• Fini les négociations sur les réseaux sociaux</li>
										<li>• Paiement 100% sécurisé</li>
										<li>• Processus rapide et automatisé</li>
										<li>• Confirmation immédiate par email</li>
									</ul>
								</div>
							</CardContent>
						</Card>

						{/* Vendeurs - Carte en bas à droite */}
						<Card className="relative overflow-hidden border-gray-400 bg-gradient-to-r from-gray-500 to-gray-600 lg:col-span-2 lg:row-span-1">
							<div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-transparent"></div>
							<div className="absolute right-4 bottom-4 opacity-20">
								<CreditCard className="h-16 w-16 text-white" />
							</div>
							<CardHeader className="relative z-10 pb-2">
								<div className="flex items-center space-x-3">
									<CreditCard className="h-10 w-10 text-white" />
									<div>
										<CardTitle className="text-xl text-white">Vendeurs</CardTitle>
										<CardDescription className="text-gray-100">Rentabilisation et flexibilité</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="relative z-10 pt-0 text-white">
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<h4 className="mb-2 font-semibold">💰 Rentabilisation</h4>
										<ul className="space-y-1 text-xs">
											<li>• Revente dernière minute (selon organisateur)</li>
											<li>• Prix défini par le vendeur</li>
											<li>• Réception des fonds immédiat</li>
										</ul>
									</div>
									<div>
										<h4 className="mb-2 font-semibold">🔄 Flexibilité</h4>
										<ul className="space-y-1 text-xs">
											<li>• Vente publique ou privée</li>
											<li>• Mise en vente rapide et simple</li>
										</ul>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Running Community Section */}
			<section className="relative overflow-hidden bg-gray-800 py-20">
				<div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
					<h2 className="mb-6 text-4xl font-bold text-white">Rejoignez la communauté BibUp</h2>
					<p className="mb-8 text-xl text-gray-300">
						De nombreux coureurs font déjà confiance à notre plateforme pour leurs transferts de dossards.
						Rejoignez-nous et recevez les actualités de vos courses préférées.
					</p>

					<div className="flex flex-col items-center space-y-6">
						<Button size="lg" className="bg-blue-600 hover:bg-blue-700">
							S'abonner
							<ArrowRight className="ml-2 h-5 w-5" />
						</Button>

						<div className="flex items-center space-x-6">
							<span className="text-gray-400">Suivez-nous :</span>
							<div className="flex space-x-4">
								<Link href="#" className="text-gray-400 transition-colors hover:text-white">
									<Instagram className="h-6 w-6" />
								</Link>
								<Link href="#" className="text-gray-400 transition-colors hover:text-white">
									<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
									</svg>
								</Link>
								<Link href="#" className="text-gray-400 transition-colors hover:text-white">
									<Twitter className="h-6 w-6" />
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* User Journeys */}
			<section className="relative overflow-hidden bg-gray-800 py-20">
				<div className="absolute inset-0 z-0">
					<img
						src="/images/running-shoes.jpg"
						alt="Chaussures de running sur marches"
						className="h-full w-full object-cover opacity-15"
					/>
				</div>
				<div className="relative z-10 mx-auto max-w-7xl px-6">
					<h2 className="mb-16 text-center text-4xl font-bold">Parcours Utilisateurs</h2>

					<div className="grid gap-12 lg:grid-cols-2">
						{/* Seller Journey */}
						<div>
							<h3 className="mb-8 text-2xl font-bold text-blue-400">Parcours Vendeur</h3>
							<div className="space-y-6">
								<div className="flex items-start space-x-4">
									<div className="mt-1 rounded-full bg-blue-600 p-2">
										<span className="text-sm font-bold">1</span>
									</div>
									<div>
										<h4 className="mb-2 font-semibold">Création de compte</h4>
										<p className="text-sm text-gray-300">Inscription rapide et confirmation par email</p>
									</div>
								</div>

								<div className="flex items-start space-x-4">
									<div className="mt-1 rounded-full bg-blue-600 p-2">
										<span className="text-sm font-bold">2</span>
									</div>
									<div>
										<h4 className="mb-2 font-semibold">Enregistrement du dossard</h4>
										<p className="text-sm text-gray-300">Saisie du numéro d'inscription et données d'inscription</p>
									</div>
								</div>

								<div className="flex items-start space-x-4">
									<div className="mt-1 rounded-full bg-yellow-600 p-2">
										<Clock className="h-4 w-4" />
									</div>
									<div>
										<h4 className="mb-2 font-semibold">Validation</h4>
										<p className="text-sm text-gray-300">Vérification auprès de l'organisateur</p>
									</div>
								</div>

								<div className="flex items-start space-x-4">
									<div className="mt-1 rounded-full bg-green-600 p-2">
										<CheckCircle className="h-4 w-4" />
									</div>
									<div>
										<h4 className="mb-2 font-semibold">Mise en vente</h4>
										<p className="text-sm text-gray-300">
											Définition du prix et publication de votre offre publique ou privée
										</p>
									</div>
								</div>

								<div className="flex items-start space-x-4">
									<div className="mt-1 rounded-full bg-blue-600 p-2">
										<CreditCard className="h-4 w-4" />
									</div>
									<div>
										<h4 className="mb-2 font-semibold">Paiement</h4>
										<p className="text-sm text-gray-300">
											Réception des fonds sur votre compte BibUp puis retirer l'argent sur votre compte bancaire
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Buyer Journey */}
						<div>
							<h3 className="mb-8 text-2xl font-bold text-green-400">Parcours Acheteur</h3>
							<div className="space-y-6">
								<div className="flex items-start space-x-4">
									<div className="mt-1 rounded-full bg-green-600 p-2">
										<span className="text-sm font-bold">1</span>
									</div>
									<div>
										<h4 className="mb-2 font-semibold">Création de compte</h4>
										<p className="text-sm text-gray-300">Inscription et confirmation par email</p>
									</div>
								</div>

								<div className="flex items-start space-x-4">
									<div className="mt-1 rounded-full bg-green-600 p-2">
										<span className="text-sm font-bold">2</span>
									</div>
									<div>
										<h4 className="mb-2 font-semibold">Recherche de course</h4>
										<p className="text-sm text-gray-300">Navigation dans les courses et dossards disponibles</p>
									</div>
								</div>

								<div className="flex items-start space-x-4">
									<div className="mt-1 rounded-full bg-green-600 p-2">
										<span className="text-sm font-bold">3</span>
									</div>
									<div>
										<h4 className="mb-2 font-semibold">Achat</h4>
										<p className="text-sm text-gray-300">Saisie des informations coureur et paiement sécurisé</p>
									</div>
								</div>

								<div className="flex items-start space-x-4">
									<div className="mt-1 rounded-full bg-green-600 p-2">
										<CheckCircle className="h-4 w-4" />
									</div>
									<div>
										<h4 className="mb-2 font-semibold">Confirmation</h4>
										<p className="text-sm text-gray-300">Email de confirmation d'achat immédiat</p>
									</div>
								</div>

								<div className="flex items-start space-x-4">
									<div className="mt-1 rounded-full bg-green-600 p-2">
										<Shield className="h-4 w-4" />
									</div>
									<div>
										<h4 className="mb-2 font-semibold">Intégration course</h4>
										<p className="text-sm text-gray-300">Confirmation d'inscription auprès de l'organisateur</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Backend Process */}
			<section className="relative overflow-hidden py-20">
				<div className="relative z-10 mx-auto max-w-7xl px-6">
					<div className="mb-16 text-center">
						<h2 className="mb-6 text-4xl font-bold">Comment ça se passe ?</h2>
						<p className="mx-auto max-w-3xl text-xl text-gray-300">
							Chaque transaction est traitée automatiquement avec la plus haute sécurité.
						</p>
					</div>

					<div className="rounded-2xl bg-gray-800 p-8">
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
									<span className="text-xl font-bold">1</span>
								</div>
								<h4 className="mb-2 font-semibold">Certification du dossard en vente</h4>
								<p className="text-sm text-gray-300">Vérification de la validité de l'inscription du vendeur</p>
							</div>

							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
									<span className="text-xl font-bold">2</span>
								</div>
								<h4 className="mb-2 font-semibold">Transfert de propriété du dossard</h4>
								<p className="text-sm text-gray-300">
									Collecte des données d'inscription du nouveau coureur et paiement
								</p>
							</div>

							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
									<span className="text-xl font-bold">3</span>
								</div>
								<h4 className="mb-2 font-semibold">Mise à jour des informations</h4>
								<p className="text-sm text-gray-300">Modification des données coureur auprès de l'organisateur</p>
							</div>

							<div className="text-center">
								<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
									<CheckCircle className="h-8 w-8" />
								</div>
								<h4 className="mb-2 font-semibold">Confirmation d'inscription</h4>
								<p className="text-sm text-gray-300">Validation finale auprès de toutes les parties et notifications</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="relative overflow-hidden py-20">
				<div className="absolute inset-0 z-0">
					<img
						src="/images/bridge-runner.jpg"
						alt="Coureur sur pont"
						className="h-full w-full object-cover opacity-40"
					/>
				</div>
				<div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
					<h2 className="mb-6 text-4xl font-bold">
						BibUp transforme la gestion des transferts de dossards en solution gagnante pour tous
					</h2>
					<div className="mb-8 space-y-2 text-xl opacity-90">
						<p>Organisateurs : réduisez vos risques et votre charge administrative</p>
						<p>Coureurs : achetez et vendez en toute sécurité, sans négociation ni stress</p>
					</div>
					<div className="flex flex-col justify-center gap-4 sm:flex-row">
						<Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
							Accéder à la WebApp
							<ArrowRight className="ml-2 h-5 w-5" />
						</Button>
						<Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
							Devenir organisateur partenaire
						</Button>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-gray-800 bg-gray-900 py-8">
				<div className="mx-auto max-w-7xl px-6">
					<div className="mb-6 flex items-center justify-between">
						<div className="text-2xl font-bold">Bibup, la marketplace sécurisée pour tous vos dossards !</div>
						<div className="flex space-x-4">
							<Link href="#" className="text-gray-400 transition-colors hover:text-white">
								<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
								</svg>
							</Link>
							<Link href="#" className="text-gray-400 transition-colors hover:text-white">
								<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
								</svg>
							</Link>
							<Link href="#" className="text-gray-400 transition-colors hover:text-white">
								<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
								</svg>
							</Link>
						</div>
					</div>

					<div className="border-t border-gray-800 pt-6">
						<div className="flex flex-col items-start justify-between md:flex-row md:items-center">
							<div className="mb-4 md:mb-0">
								<p className="text-xs text-gray-400">© 2025</p>
								<p className="text-xs text-gray-500">Tous droits réservés</p>
							</div>

							<div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-8">
								<div className="flex space-x-6 text-sm">
									<Link href="/race" className="text-gray-400 transition-colors hover:text-white">
										Courses
									</Link>
									<Link href="/calendrier" className="text-gray-400 transition-colors hover:text-white">
										Calendrier
									</Link>
									<Link href="/marketplace" className="text-gray-400 transition-colors hover:text-white">
										Marketplace
									</Link>
									<Link href="/faq" className="text-gray-400 transition-colors hover:text-white">
										FAQ
									</Link>
									<Link href="/contact" className="text-gray-400 transition-colors hover:text-white">
										Contact
									</Link>
								</div>
								<div className="flex space-x-6 text-sm">
									<Link href="#" className="text-gray-500 transition-colors hover:text-gray-300">
										Confidentialité
									</Link>
									<Link href="#" className="text-gray-500 transition-colors hover:text-gray-300">
										Conditions
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}
