import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Button, Card, Col, Container, Grid, Navbar, Spacer, Text } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { useSession, signIn, signOut } from "next-auth/react"
import Tilt from 'react-parallax-tilt';

const inter = Inter({ subsets: ['latin'] })
const contents = ["Dashboard"]
const main_message = "Solving all your dietary problems and more"
const side_message = "Using artificial intelligence to get valuable insight"
const benefits_1 = ["Learn about your food 📝", "Know if your food is safe 🦺"]
const benefits_2 = ["Fix unhealthy diets ✅", "Prevent stomacheaches 🤢"]

export default function Home() {

  const route = useRouter()

  const handleClick = () => {
    signIn("google")
  }

  return (
    <div>
      <Navbar isBordered variant={"sticky"}>
        <Navbar.Brand>
          <Text color="inherit" h2 weight={"bold"}>
            {'Snacklit 🍏'}
          </Text>
        </Navbar.Brand>
        {
          // Navbar
          <Navbar.Content>
          {
            contents.map((value) => {
              return (
                <Navbar.Link href="/dashboard">
                  <Text weight={"semibold"} color='#4a4a4a'>
                    {value}
                  </Text>
                </Navbar.Link>
              )
            })
          }
          </Navbar.Content>
        }
        <Button shadow color={"gradient"} auto ripple style={{
          boxShadow: "0 0px 15px rgba(253, 83, 249, 0.8)"
        }} onPress={handleClick}>
          Sign Up
        </Button>
      </Navbar>
      <Spacer y={5}/>
      <Grid.Container css={{
        left: "$4xl",
        position: "relative"
      }}>
        <Col>
          <Text h2 color='#4a4a4a' weight={"bold"} css={{
            maxWidth: "50%"
          }}>
            {main_message}
          </Text>
          <Text>
            {side_message}
          </Text>
        </Col>
      </Grid.Container>

      <Spacer y={2}/>

      <Grid.Container css={{
        left: "$4xl",
        position: "relative"
      }} gap={1}>
        {
          benefits_1.map((v) => {
            return (
              <Grid >
                <Button size={'sm'} auto animated bordered shadow css={{
                  border: 0,
                  boxShadow: "0.3 8px 30px rgba(95, 95, 95, 0.8)",
                  
                }}>
                  {v}
                </Button>
              </Grid> 
            )
          })
        }
      </Grid.Container>
      
      <Grid.Container css={{
        left: "$4xl",
        position: "relative"
      }} gap={1}>
        {
          benefits_2.map((v) => {
            return (
              <Grid >
                <Button size={'sm'} auto animated bordered shadow css={{
                  border: 0,
                  boxShadow: "0.3 8px 30px rgba(95, 95, 95, 0.8)",
                  
                }}>
                  {v}
                </Button>
              </Grid> 
            )
          })
        }
      </Grid.Container>
      <Spacer y={1}/>
      <Button animated shadow color={"gradient"} ripple bordered css={{
          boxShadow: "0 0px 15px rgba(253, 83, 249, 0.8)",
          width: "10%",
          left: "$4xl",
        position: "relative"
        }} onPress={handleClick}>
        Start
      </Button>

      <Tilt glareEnable={true}>
      <div style={{ position: 'fixed', right: '20%', top: "-180px" }}>
        <Card css={{
          width: 300,
          height: 300
        }} isHoverable>
          <Card.Image src={'https://www.collinsdictionary.com/images/full/rottenapple_435795946.jpg'} objectFit='cover' width="100%" height="100%"/>
          <Card.Footer>
            {'✔️Rotten Apple'}
          </Card.Footer>
          <Card.Footer>
            {'✔️Edible object'}
          </Card.Footer>
          <Card.Footer>
            {'A rotten red apple. The average calories of an apple is %calories.'}
          </Card.Footer>
        </Card>
      </div>
    </Tilt>
    </div>
  )
}
