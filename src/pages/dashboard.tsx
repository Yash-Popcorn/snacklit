import { Button, Card, Container, Grid, Image, Input, Link, Loading, Modal, Spacer, Text } from "@nextui-org/react"
import { useSession } from "next-auth/react"
import PocketBase from 'pocketbase';
import { ChangeEvent, useEffect, useRef, useState } from "react";
import confetti from 'canvas-confetti';
import { useRouter } from "next/router";

interface food_interface {
    email: string
    information: string
    time_created: string
    date_created: string
}

const options = [
    "Create new item",
    "Create new recipe",
    "My collection",
    "My recipes"
]

const pb = new PocketBase('https://losaltos-hacks.pockethost.io');
const file_redirect = "https://losaltos-hacks.pockethost.io/api/files/k051hg0un1oo6p9/"
const file_redirect_2 = "https://losaltos-hacks.pockethost.io/api/files/aunw3lm5y9z4fks/"

export default function dashboard() {

    const { data } = useSession()
    const [num, setNum] = useState(-1)
    const [open, setOpen] = useState(false)
    const [openSuccess, setSuccess] = useState(false)
    const [openRecipe, setOpenRecipe] = useState(false)
    const [imageURL, setURL] = useState("")
    const [file, setFile] = useState<undefined | File>()
    const [item_info, setItemInfo] = useState<food_interface>({
        email: "",
        information: "",
        time_created: "",
        date_created: ""
    })
    const [response, setResponse] = useState("")
    const [isLoading, setLoading] = useState(false)
    const route = useRouter()

    const name = data?.user?.name || "N/A"
    const email = data?.user?.email || "N/A"
    
    const handleItems = async () => {
        try {
            // still need to fix this and use a different email and password by using local env
            //const authData = await pb.admins.authWithPassword(process.env.EMAIL || "turtlesseth@gmail.com", process.env.PASSWORD || "yashkin123");
            const records = await pb.collection('objects').getFullList({
                sort: '-created',
            });
            let c = 0

            records.map((v) => {
                if (v.email === (data && data.user?.email || "")) c++
            })

            setNum(c)
        } catch (err) {
            console.log(err)
        }
        
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            //setURL(URL.createObjectURL(e.target.files[0]))
            //setFile(e.target.files[0])
            setFile(e.target.files[0])
            setURL(URL.createObjectURL(e.target.files[0]))
        }
    }

    const handleSubmit = async () => {
        if (file) {
            
            const formData = new FormData()
            formData.append("image", file)
            formData.append("information", "test")
            formData.append("email", email)
            formData.append("time_created", `${item_info.date_created}, ${item_info.time_created}`)
            
            const record = await pb.collection('objects').create(formData)
            const hosted_food_url = `${file_redirect}${record.id}/${record.image}`

            try {
                setLoading(true)
                const response = await fetch('http://localhost:8000/get_info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        url: `${hosted_food_url}`,
                    })
                })
                const result = await response.text()
                await pb.collection('objects').update(record.id, {
                    "information": result
                })
                setLoading(false)
                setOpen(false)
                setItemInfo({
                    email: "",
                    information: "",
                    time_created: "",
                    date_created: ""
                })
                setResponse(result)
                setURL("")
                setNum(num + 1)
                confetti({
                    particleCount: 100,
                    startVelocity: 30,
                    spread: 360,
                    origin: {
                      x: Math.random(),
                      // since they fall down, start a bit higher than random
                      y: Math.random() - 0.2
                    },
                    zIndex: 10000000
                  })
                  setSuccess(true)
            } catch (e) {
                console.log(e)
            }
            
        }
    }

    const handleRecipe = async () => {
        if (file) {
            setLoading(true)

            const formData = new FormData()
            formData.append("image", file)
            formData.append("information", "test")
            formData.append("email", email)
            
            const record = await pb.collection('recipes').create(formData)
            const hosted_food_url = `${file_redirect_2}${record.id}/${record.image}`

            try {
                const response = await fetch('http://localhost:8000/get_recipe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        url: `${hosted_food_url}`,
                    })
                })
                const result = await response.json()
                console.log(result)
                const items: string[] = result.recipe.replace(",", "").split(/\d+\./).map((item: string) => item.trim()).filter((item: string) => `${item} <br>`);
                
                
                await pb.collection('recipes').update(record.id, {
                    "information": result.recipe
                })
                
                setLoading(false)
                setOpen(false)
                setOpenRecipe(false)
                setItemInfo({
                    email: "",
                    information: "",
                    time_created: "",
                    date_created: ""
                })
                setResponse(`${items} <br> Detected foods:${result.foods}`)
                setURL("")
                setNum(num + 1)
                confetti({
                    particleCount: 100,
                    startVelocity: 30,
                    spread: 360,
                    origin: {
                      x: Math.random(),
                      // since they fall down, start a bit higher than random
                      y: Math.random() - 0.2
                    },
                    zIndex: 10000000
                  })
                  setSuccess(true)
            } catch (e) {
                console.log(e)
            }
            
        }
    }

    useEffect(() => {
        handleItems()
    }, [data])

    if (data === null || num == -1) return (
        <Loading>
            Fetching your data
        </Loading>
    )

    return (
        <div>
            <Container css={{
                maxWidth: "20%",
                left: 0,
                position: "fixed",
                marginLeft: -10,
            }}>
            <Card color="pink" css={{
                color: "Pink"
            }}>
                <Card.Header>
                    <Text weight={"bold"}>
                        Dashboard
                    </Text>
                </Card.Header>
                {
                    options.map((v) => {
                        return (
                            <Button css={{
                                marginBottom: 5,
                                scale: 0.85
                            }} auto animated ripple key={v} onPress={() => {
                                if (v === "Create new item") {
                                    setOpen(true)
                                } else if (v === "My collection") {
                                    route.push('/collection')
                                } else if (v === "Create new recipe") {
                                    setOpenRecipe(true)
                                } else {
                                    route.push('/recipes')
                                }
                            }}>
                                {v}
                            </Button>
                        )
                    })
                }
                <Spacer y={30}/>
            </Card>
            </Container>
            <Container css={{
                left: "$60",
                position: "relative"
            }}>
                <Text h2 weight={"bold"} color="rgba(52, 52, 52, 0.8)">
                    {`Hello ${name}`}
                </Text>
                <Card css={{
                    maxWidth: "30%",
                    color: "rgba(52, 52, 52, 0.8)"
                }} variant="bordered" borderWeight="bold" color="rgba(52, 52, 52, 0.8)" isHoverable>
                    <Card.Body>
                        <Text h3 color="rgba(52, 52, 52, 0.8)">
                            We learned that...
                        </Text>
                    </Card.Body>
                    <Card.Footer>
                        <Text h5 color="rgba(52, 52, 52, 0.8)">
                            {`You currently have ${num} item(s) in your collection`}
                        </Text>
                    </Card.Footer>
                </Card>
                <Spacer y={1}/>
                <Card css={{
                    maxWidth: "30%",
                    position: "relative",
                    zIndex: 0,
                    "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: -1,
                    background: "linear-gradient(90deg, #2A2E34 60.42%, #9C3784 100%)",
                    borderColor: "Black"
                    }
                }} borderWeight="bold" isHoverable>
                    <Card.Header>
                        <img
                            alt="nextui logo"
                            src="https://cdn.shopify.com/s/files/1/1061/1924/products/Robot_Emoji_Icon_abe1111a-1293-4668-bdf9-9ceb05cff58e_grande.png?v=1571606090"
                            width="34px"
                            height="34px"
                        />
                        <Grid.Container css={{ pl: "$6" }}>
                            <Grid xs={12}>
                                <Text h4 css={{ lineHeight: "$xs" , color: "White"}}>
                                Robot
                                </Text>
                            </Grid>
                            <Grid xs={12}>
                                <Text css={{ color: "White" }}>Mr. Robo</Text>
                            </Grid>
                        </Grid.Container>
                    </Card.Header>
                    <Card.Body css={{ py: "$2" }}>
                        <Text css={{ color: "White", marginBottom: 10 }}>
                            Feed me images of your food and I will provide <span style={{ fontWeight: "bold" }}>TONS</span> of information
                        </Text>
                    </Card.Body>
                </Card>
            </Container>
            <Modal open={open} onClose={() => {
                setOpen(false)
            }}>
                <Modal.Header
                    css={{ position: "absolute", zIndex: "$1", top: 5, left: 8 }}>
                    <Text h2>
                        Create new item
                    </Text>
                </Modal.Header>
                <Spacer y={4}/>

                <Button css={{
                    maxWidth: "60%",
                    left: "$10"
                }}>
                    <input type="file" style={{ display: "" }} accept="image/jpeg,image/webp,image/png" onChange={(e) => {
                        handleFileChange(e)
                    }}/>
                </Button>
                <Spacer y={1}/>
                <Input type="date" css={{
                    maxWidth: "30%",
                    left: "$10"
                }} label="Date of expiration" bordered onChange={(e) => {
                    console.log(e.target.value)
                    setItemInfo({
                        ...item_info,
                        date_created: e.target.value,
                    })
                }}/>
                <Spacer y={1}/>
                <Input type="time" css={{
                    maxWidth: "30%",
                    left: "$10"
                }} label="Time to remind" onChange={(e) => {
                    console.log(e.target.value)
                    setItemInfo({
                        ...item_info,
                        time_created: e.target.value,
                    })
                }} bordered/>
                <Modal.Body>
                    {
                        imageURL !== "" && (
                            <>
                                <Image
                                    showSkeleton
                                    src={imageURL}
                                    width={800}
                                    height={490 * .5}
                                />
                                <Button animated shadow color={"gradient"} ripple css={{
                                    boxShadow: "0 0px 15px rgba(253, 83, 249, 0.8)",
                                    width: "10%",
                                    position: "relative"
                                    }} onPress={handleSubmit}>
                                    {
                                        isLoading && (
                                            <Loading type="points" color="white"/>
                                        ) || (
                                            "Submit"
                                        )
                                    }
                                </Button>
                            </>
                            
                        ) || (
                            <div>
                                
                            </div>
                        )
                    }
                </Modal.Body>
            </Modal>

            <Modal open={openSuccess} aria-labelledby="modal-title" onClose={() => {
                setSuccess(false)
            }}>
                <Modal.Header>
                    <Text id="modal-title" size={18}>
                        Congratulations,
                        <Text b size={18}>
                        {`${name}🎉`}
                        </Text>
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Text>
                        {response}
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                <Button auto flat color="error" onPress={() => {
                    setSuccess(false)
                }}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal open={openRecipe} onClose={() => {
                setOpenRecipe(false)
            }}>
                <Modal.Header
                    css={{ position: "absolute", zIndex: "$1", top: 5, left: 8 }}>
                    <Text h2>
                        Create new recipe
                    </Text>
                </Modal.Header>
                <Spacer y={4}/>

                <Button css={{
                    maxWidth: "60%",
                    left: "$10"
                }}>
                    <input type="file" style={{ display: "" }} accept="image/jpeg,image/webp,image/png" onChange={(e) => {
                        handleFileChange(e)
                    }}/>
                </Button>
                <Spacer y={1}/>
                
                <Modal.Body>
                    {
                        imageURL !== "" && (
                            <>
                                <Image
                                    showSkeleton
                                    src={imageURL}
                                    width={800}
                                    height={490 * .5}
                                />
                                <Button animated shadow color={"gradient"} ripple css={{
                                    boxShadow: "0 0px 15px rgba(253, 83, 249, 0.8)",
                                    width: "10%",
                                    position: "relative"
                                    }} onPress={handleRecipe}>
                                    {
                                        isLoading && (
                                            <Loading type="points" color="white"/>
                                        ) || (
                                            "Submit"
                                        )
                                    }
                                </Button>
                            </>
                            
                        ) || (
                            <div>
                                
                            </div>
                        )
                    }
                </Modal.Body>
            </Modal>
        </div>
    )
}