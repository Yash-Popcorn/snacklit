import { Button, Navbar, Text } from "@nextui-org/react"
import { useRouter } from "next/router"

export default function Nav() {
    const router = useRouter()

    const handleClick = () => {
        router.push('/dashboard')
    }

    return (
        <Navbar isBordered variant={"sticky"}>
            <Navbar.Brand>
            <Text color="inherit" h2 weight={"bold"}>
                {'Snacklit 🍏'}
            </Text>
            </Navbar.Brand>
            <Button shadow color={"gradient"} auto ripple style={{
            boxShadow: "0 0px 15px rgba(253, 83, 249, 0.8)"
            }} onPress={handleClick}>
            Dashboard
            </Button>
        </Navbar>
    )
}