'use client'

import { useState, useEffect, useContext } from "react"
import { GlobalContext } from "@/context/global";
import { useRouter } from "next/navigation";
import Separator from "@/components/fragments/separatorLine";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeletModal from "@/components/Modal/deletModal";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import AddGuest from "@/components/Modal/addGuest";
import InvitesModal from "@/components/Modal/invitesDownload";
import ChangeModal from "@/components/Modal/chancgePassword";
import Loader from "@/components/fragments/loader";
import SplideCard from "@/components/fragments/splideCard";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import '@splidejs/react-splide/css/skyblue';
import '@splidejs/react-splide/css/sea-green';
import '@splidejs/react-splide/css/core';


export default function EventGuest() {
  const router = useRouter();
  const { KONG_URL, user, eventEdit, eventChoice, eventClasses, setRefreshPage, refreshPage } = useContext(GlobalContext);
  const [addGuestModalIsOpen, setAddGuestModalIsOpen] = useState(false);
  const [deleteGuestModalIsOpen, setDeleteGuestModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [getingGuests, setGetingGuests] = useState(false);
  const [invitesOpen, setInvitesOpen] = useState(false)

  const [eventName, setEventName] = useState();
  const [className, setClassName] = useState();
  const [classGuestId, setClassGuestId] = useState();

  const [myId, setMyId] = useState();
  const [myData, setMyData] = useState();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [date, setDate] = useState("");

  const [guests, setGuests] = useState([]);

  const [guestEditId, setGuestEditId] = useState();
  const [guestData, setGuestData] = useState();
  const [guestDeleteId, setGuestDeleteId] = useState();
  const [guestEditName, setGuestEditName] = useState();
  const [typesData, setTypesData] = useState([]);

  const [newPasswordModal, setNewpasswordModal] = useState(false);

  async function getGuests(eventId) {

    let x;
    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")

    if (!!jwt && !!eventId) {

      setGetingGuests(true);
      try {
        x = await (await fetch(`${KONG_URL}/user/guests/${eventId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          }
        })).json()

        if (!x.message) {
          setGetingGuests(false);
          setMyId(x.id)
          setGuests(x.other_guests)
          return ""
        }

      } catch (error) {
        setGetingGuests(false);
        return ""
      }
    } else {
      setGetingGuests(false);
      return ""
    }
  }

  async function getAllData() {

    let x;
    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")

    if (!!myId) {

      try {
        x = await (await fetch(`${KONG_URL}/student/${myId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          }
        })).json()

        if (!x.message) {
          setMyData(x)
          return ""
        }

      } catch (error) {

        return ""
      }
    } else {

      return ""
    }
  }


  async function deleteGuest() {

    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")

    let x;

    if (!!jwt && !!classGuestId && !!guestDeleteId) {
      setIsLoading(true);
      try {
        x = await (await fetch(`${KONG_URL}/student/acompanhante/add/${classGuestId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          },
          body: JSON.stringify({
            id: guestDeleteId,
            situation: 2
          })
        })).json()

        if (!!x?.guest) {
          toast.success("Convidado Deletado com sucesso.", {
            position: "top-right"
          });
          setDeleteGuestModalIsOpen(false);
          setGuestDeleteId("")
          setIsLoading(false);
        }
      } catch (error) {
        toast.error("Erro ao Deletar Convidado.", {
          position: "top-right"
        });
        setIsLoading(false);
        console.log("erro")
        return ""
      }
    } else {
      toast.error("Erro ao Deletar Convidado.", {
        position: "top-right"
      });
      console.log("else")
    }
  }

  function openAddGuest() {
    setGuestData('')
    setAddGuestModalIsOpen(true)
  }

  function openEditGuest(e, data) {
    e.preventDefault();

    setGuestData(data)
    setAddGuestModalIsOpen(true)
  }

  function closeAddGuest() {
    let x = !!eventChoice ? eventChoice : localStorage.getItem("event_choice");
    let y = JSON.parse(x)

    setGuestEditId("");
    setGuestEditName("");
    getGuests(y.classEvent.id);
    setRefreshPage(!refreshPage);
    setAddGuestModalIsOpen(false);
  }

  function openDeleteGuest(e, id) {
    e.preventDefault();

    setGuestDeleteId(id)
    setDeleteGuestModalIsOpen(true)
  }

  function closeDeleteGuest() {

    setGuestDeleteId("");
    setRefreshPage(!refreshPage);
    setDeleteGuestModalIsOpen(false);
  }

  function openChangePassword() {

    setNewpasswordModal(true)
  }

  function deleteChangePassword() {

    setNewpasswordModal(false)
  }



  async function getAvaibles() {
    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt");
    let y = !!eventChoice ? JSON.parse(eventChoice) : JSON.parse(localStorage.getItem("event_choice"));

    let theClass = y?.classEvent.id

    let x;

    if (!!jwt && !!theClass) {
      try {
        x = await (await fetch(`${KONG_URL}/user/guests/${theClass}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          }
        })).json()

        if (!x?.message) {
          setTypesData(x.guestsTicketsTypeNumber);
        } else {
          console.log("error", x)
        }


      } catch (error) {
        console.log("catch", error)
        return ""
      }
    }
  }

  function setInvitesOpenModal() {

    setInvitesOpen(true)
  }
  function setInvitesCloseModal() {
    setInvitesOpen(false)
  }

  useEffect(() => {
    let x = !!eventChoice ? eventChoice : localStorage.getItem("event_choice");
    let y = JSON.parse(x)

    let w = !!eventClasses ? eventClasses : localStorage.getItem("event_classes");
    let z = JSON.parse(w)



    if (!!y && !!z) {
      console.log(y, z, "aaaaaaa")
      getGuests(y.classEvent.id);

      setClassGuestId(y.classEvent.id);
      setEventName(z.name);
      setClassName(y?.classEvent?.name);
      setName(y?.user?.name);
      setPhone(y.user?.phone);
      setEmail(y.user?.email);
      setDate(formatDateToInput(z.date));
    }
  }, [eventChoice, eventClasses, refreshPage])

  useEffect(() => {
    getAvaibles();

  }, [addGuestModalIsOpen])

  useEffect(() => {
    getAllData()

  }, [myId])

  useEffect(() => {
    setGuestData('')
  }, [])

  function formatDateToInput(dataString) {
    const data = new Date(dataString);

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${ano} às ${horas}:${minutos} horas`;
  }

  return (
    <div className="clienteMain flexr">
      <ToastContainer></ToastContainer>
      {!!newPasswordModal && <ChangeModal close={(event) => deleteChangePassword(event)}></ChangeModal>}
      {!!invitesOpen && <InvitesModal close={() => setInvitesCloseModal()} data={myData} jwt={!!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")} url={KONG_URL} ></InvitesModal>}
      {!!deleteGuestModalIsOpen && <DeletModal close={() => closeDeleteGuest()} func={() => deleteGuest()} word={"confirmar"}></DeletModal>}
      {!!addGuestModalIsOpen && <AddGuest close={() => closeAddGuest()} classId={classGuestId} typesData={typesData} guestData={guestData}></AddGuest>}
      <div className="clienteContent flexc">
        <div className="adminUsersHeader flexr" style={{ margin: "10px 0" }}>
          <div className="adminUsersTitle flexr" style={{ justifyContent: "flex-start" }}>
            <h1>{!!eventName && eventName}</h1>
          </div>
          <div className="adminUsersAdd flexr" style={{ gap: "10px", width: "auto" }}>
            <button
              onClick={() => setInvitesOpenModal()}
              className="btnBlue">
              Baixar Ingresso
            </button>
            <button
              onClick={(event) => openChangePassword(event)}
              className="btnOrange">
              Alterar Senha
            </button>
          </div>
        </div>
        <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>
        <div className="clienteUl clienteUlChange flexr" style={{ margin: "0px" }}>
          <div className="clienteTitleDiv flexr">
            {!!name &&
              <div className="clienteEventDiv flexc">
                <div className="clienteEventLineItem flexr" >
                  <h4>Nome: </h4><h4><span>{name || "-"}</span></h4>
                </div>
                <div className="clienteEventLineItem flexr" >
                  <h4>Telefone: </h4><h4><span>{phone || "-"}</span></h4>
                </div>
                <div className="clienteEventLineItem flexr" style={{ marginBottom: "20px" }}>
                  <h4>E-mail: </h4><h4><span>{email || "-"}</span></h4>
                </div>
                <Separator color={"var(--grey-ligth)"} width="60%" height="1px"></Separator>
                <div className="clienteEventLineItem flexr" style={{ marginTop: "20px" }}>
                  <h4>Evento: </h4><h4><span>{eventName || "-"}</span></h4>
                </div>
                <div className="clienteEventLineItem flexr">
                  <h4>Turma: </h4><h4><span>{className || "-"}</span></h4>
                </div>
                <div className="clienteEventLineItem flexr">
                  <h4>Data: </h4><h4><span>{date || "Não definido"}</span></h4>
                </div>
              </div>
            }
          </div>
          <div className="clienteTitleDivSplider flexr">
            <Splide aria-label="My Favorite Images">
              <SplideSlide>
                <SplideCard></SplideCard>
              </SplideSlide>
              <SplideSlide>
                <SplideCard></SplideCard>
              </SplideSlide>
            </Splide>
          </div>

        </div>
        {!!name &&
          <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>
        }
        <div className="adminUsersAdd flexr" style={{ gap: "10px", width: "100%", padding: "15px 40px" }}>
          <h1 style={{ fontSize: "22px" }}>Convidados</h1>
          <div className="adminUsersAdd flexr" style={{ width: "auto%", justifyContent: "flex-end" }}>
            <button
              onClick={() => openAddGuest()}
              className="btnOrange">Adicionar Convidado</button>
          </div>
        </div>
        <div
          style={{
            margin: "0"
          }}
          className="clienteUl flexc">
          <div className="clienteTitle flexr">

            <p className="clienteAvaibleLi" style={{ minWidth: "60px" }}>Ingresso</p>
            <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
            <p className="eventNameLi">Nome</p>
          </div>
          <div className="clienteUl flexc"
            style={{
              margin: 0,
              height: "200px",
              overflowY: "auto"
            }}>
            {getingGuests == true ?

              <Loader></Loader>

              :

              guests?.length > 0 ? guests.sort((a, b) => a.name.localeCompare(b.name)).sort((a, b) => a.tycketsType?.description.localeCompare(b.tycketsType?.description)).map((e, y) => {
                return (
                  <div
                    onClick={(event) => openEditGuest(event, e)}
                    key={y} className="clienteLine flexr">
                    <p className="clienteAvaibleLi" style={{ minWidth: "60px" }}>{e.tycketsType?.description}</p>
                    <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                    <p className="eventNameLi" style={{ whiteSpace: "nowrap" }}>{e.name}</p>
                    <div className="userConfigbtns flexr">
                      <div
                        onClick={(event) => openEditGuest(event, e)}
                        className="userConfigbtn flexr"><EditIcon className="userConfigIcon"></EditIcon></div>
                      <div
                        onClick={(event) => { openDeleteGuest(event, e.id) }}
                        className="userConfigbtn flexr">
                        <DeleteIcon className="userConfigIcon"></DeleteIcon>
                      </div>
                    </div>
                  </div>
                )
              })
                :
                <p style={{ marginTop: "50px" }}>Nenhum convidado</p>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
