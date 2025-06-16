import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

import Image from 'next/image'

export default function Header() {
	return (
		<Disclosure as="nav" className="bg-gray-800">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center">
						<div className="shrink-0">
							<Image alt="Beswib" className="h-8 w-auto" src="/beswib.svg" />
						</div>
						<div className="hidden sm:ml-6 sm:block">
							<div className="flex space-x-4">
								{/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
								<a className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" href="#">
									Dashboard
								</a>
								<a
									className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
									href="#"
								>
									Team
								</a>
								<a
									className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
									href="#"
								>
									Projects
								</a>
								<a
									className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
									href="#"
								>
									Calendar
								</a>
							</div>
						</div>
					</div>
					<div className="hidden sm:ml-6 sm:block">
						<div className="flex items-center">
							<button
								className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
								type="button"
							>
								<span className="absolute -inset-1.5" />
								<span className="sr-only">View notifications</span>
								<BellIcon aria-hidden="true" className="size-6" />
							</button>

							{/* Profile dropdown */}
							<Menu as="div" className="relative ml-3">
								<div>
									<MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
										<span className="absolute -inset-1.5" />
										<span className="sr-only">Open user menu</span>
										<img
											alt=""
											className="size-8 rounded-full"
											src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
										/>
									</MenuButton>
								</div>
								<MenuItems
									className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
									transition
								>
									<MenuItem>
										<a
											className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
											href="#"
										>
											Your Profile
										</a>
									</MenuItem>
									<MenuItem>
										<a
											className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
											href="#"
										>
											Settings
										</a>
									</MenuItem>
									<MenuItem>
										<a
											className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
											href="#"
										>
											Sign out
										</a>
									</MenuItem>
								</MenuItems>
							</Menu>
						</div>
					</div>
					<div className="-mr-2 flex sm:hidden">
						{/* Mobile menu button */}
						<DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
							<span className="absolute -inset-0.5" />
							<span className="sr-only">Open main menu</span>
							<Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
							<XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
						</DisclosureButton>
					</div>
				</div>
			</div>

			<DisclosurePanel className="sm:hidden">
				<div className="space-y-1 px-2 pt-2 pb-3">
					{/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
					<DisclosureButton
						as="a"
						className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
						href="#"
					>
						Dashboard
					</DisclosureButton>
					<DisclosureButton
						as="a"
						className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
						href="#"
					>
						Team
					</DisclosureButton>
					<DisclosureButton
						as="a"
						className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
						href="#"
					>
						Projects
					</DisclosureButton>
					<DisclosureButton
						as="a"
						className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
						href="#"
					>
						Calendar
					</DisclosureButton>
				</div>
				<div className="border-t border-gray-700 pt-4 pb-3">
					<div className="flex items-center px-5">
						<div className="shrink-0">
							<img
								alt=""
								className="size-10 rounded-full"
								src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
							/>
						</div>
						<div className="ml-3">
							<div className="text-base font-medium text-white">Tom Cook</div>
							<div className="text-sm font-medium text-gray-400">tom@example.com</div>
						</div>
						<button
							className="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
							type="button"
						>
							<span className="absolute -inset-1.5" />
							<span className="sr-only">View notifications</span>
							<BellIcon aria-hidden="true" className="size-6" />
						</button>
					</div>
					<div className="mt-3 space-y-1 px-2">
						<DisclosureButton
							as="a"
							className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
							href="#"
						>
							Your Profile
						</DisclosureButton>
						<DisclosureButton
							as="a"
							className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
							href="#"
						>
							Settings
						</DisclosureButton>
						<DisclosureButton
							as="a"
							className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
							href="#"
						>
							Sign out
						</DisclosureButton>
					</div>
				</div>
			</DisclosurePanel>
		</Disclosure>
	)
}
