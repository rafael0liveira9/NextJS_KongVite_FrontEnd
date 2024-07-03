'use client'

import { useState, useEffect, useContext } from "react"
import { GlobalContext } from "@/context/global";
import { useRouter } from "next/navigation";
import Separator from "@/components/fragments/separatorLine";
import Loader from "@/components/fragments/loader";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { FaLongArrowAltRight } from "react-icons/fa";
import ImageModal from "@/components/Modal/imageModal";
import { TiPlus } from "react-icons/ti";
import { FaImage } from "react-icons/fa";
import DeleteIcon from '@mui/icons-material/Delete';

export default function EventsAdd() {
  const router = useRouter();
  const { KONG_URL, user, eventsType, eventsSubType } = useContext(GlobalContext);
  const [name, setName] = useState();
  const [date, setDate] = useState();
  const [onlyDate, setOnlyDate] = useState();
  const [onlyHour, setOnlyHour] = useState();
  const [place, setPlace] = useState();
  const [address, setAddress] = useState();
  const [zipcode, setZipcode] = useState();
  const [numberAdress, setNumberAdress] = useState();
  const [neighborhood, setNeighborhood] = useState();
  const [city, setCity] = useState();
  const [uf, setUf] = useState();
  const [notifyUsersAboutDeletingInvitations, setNotifyUsersAboutDeletingInvitations] = useState("NAO");
  const [type, setType] = useState("FORMATURA");
  const [subType, setSubType] = useState("JANTAR");
  const [nameError, setNameError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [cepError, setCepError] = useState(false);
  const [adressError, setAdressErrorError] = useState(false);
  const [adressNumberError, setAdressNumberError] = useState(false);
  const [neighborhoodError, setNeighborhoodError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [ufError, setUfError] = useState(false);
  const [passType, setPassType] = useState([]);
  const [passTypeObject, setPassTypeObject] = useState({
    name: "",
    image: ""
  });
  const [isLoading, setisLoading] = useState(false);
  const [isFileUploading, setisFileUploading] = useState(false);
  const [galeryOpen, setGaleryOpen] = useState(false);
  const [imageToShow, setImageToShow] = useState("");

  const colors = [
    '#0B192E',
    '#2E64AD',
    '#18A87C',
    '#00E1E2'
  ];

  const statesBR = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MS',
    'MT',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO'
  ]

  function formatDateToInput(dataString) {

    // data.setHours(data.getHours() - 3);

    // const ano = data.getFullYear();
    // const mes = String(data.getMonth() + 1).padStart(2, '0');
    // const dia = String(data.getDate()).padStart(2, '0');
    // const horas = String(data.getHours()).padStart(2, '0');
    // const minutos = String(data.getMinutes()).padStart(2, '0');

    return moment(dataString).utc().format("YYYY-MM-DD HH:mm");

  }

  const combineDateTime = () => {
    if (onlyDate && onlyHour) {
      return `${onlyDate}T${onlyHour}`;
    }
    return '';
  };

  const splitDateTime = (date) => {
    const [datePart, timePart] = date.split(' ');
    setOnlyDate(datePart);
    setOnlyHour(timePart);
  };

  function dataVerify() {
    if (name?.length > 0 && name?.length < 2) {
      setNameError(true)
    } else {
      setNameError(false)
    }

    if (address?.length > 0 && address?.length < 2) {
      setAdressErrorError(true)
    } else {
      setAdressErrorError(false)
    }

    if (zipcode?.length > 0 && zipcode?.length < 6) {
      setCepError(true)
    } else {
      setCepError(false)
    }

    if (neighborhoodError?.length > 0 && neighborhoodError?.length < 4) {
      setNeighborhoodError(true)
    } else {
      setNeighborhoodError(false)
    }

    if (city?.length > 0 && city?.length < 4) {
      setCityError(true)
    } else {
      setCityError(false)
    }

    if (uf?.length > 0 && uf?.length < 2) {
      setUfError(true)
    } else {
      setUfError(false)
    }
  }


  async function addNewEvent(e) {
    e.preventDefault();
    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")

    let x;

    if (!!jwt && (
      nameError == false &&
      dateError == false &&
      cepError == false &&
      neighborhoodError == false &&
      cityError == false &&
      adressNumberError == false &&
      adressError == false
    )) {
      setisLoading(true)

      let w = combineDateTime()

      try {

        console.log('**********', {
          name: name,
          date: date,
          address: address,
          place: place,
          zipcode: zipcode,
          number: numberAdress,
          neighborhood: neighborhood,
          city: city,
          uf: uf,
          notifyUsersAboutDeletingInvitations: notifyUsersAboutDeletingInvitations,
          type: type,
          subType: subType
        })
        x = await (await fetch(`${KONG_URL}/companys/events/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          },
          body: JSON.stringify({
            name: name,
            date: date,
            address: address,
            place: place,
            zipcode: zipcode,
            number: numberAdress,
            neighborhood: neighborhood,
            city: city,
            uf: uf,
            notifyUsersAboutDeletingInvitations: notifyUsersAboutDeletingInvitations,
            type: type,
            subType: subType
          })
        })).json()

        if (!x?.message) {
          toast.success("Evento cadastrado.", {
            position: "top-right"
          });

          for (let index = 0; index < passType.length; index++) {
            addPassTypes(jwt, x.id, passType[index]);
          }


          setisLoading(false)
          router.push('/cliente/eventos/');
        } else {
          toast.error("Erro ao Cadastrar, tente novamente.", {
            position: "top-right"
          });
          setisLoading(false)
        }


      } catch (error) {
        toast.error("Erro ao Cadastrar, tente novamente.", {
          position: "top-right"
        });
        setisLoading(false)
        return ""
      }
    }
  }

  async function addPassTypes(jwt, event, data) {
    if (!!jwt && !!event && !!data) {
      try {
        x = await (await fetch(`${KONG_URL}/companys/tycketsType/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          },
          body: JSON.stringify({
            description: data.name,
            eventsId: event,
            image: ""
          })
        })).json()

        return x
      } catch (error) {
        toast.error(`Erro ao Cadastrar Tipo de Ingresso ${data.name}, tente novamente.`, {
          position: "top-right"
        });
      }
    }
  }

  const addPassType = (event) => {
    event.preventDefault();

    console.log('aqqqqq')

    if (passTypeObject.name.length != 0 && passTypeObject.image.length != 0) {
      console.log('aqqqqq2222')
      setPassType([...passType, passTypeObject]);
      console.log('aqqqqq3333')
      setPassTypeObject({ name: '', image: '' });
      console.log('aqqqqq44444')
    }
  };

  const deletePassType = (name, event) => {
    event.preventDefault();

    const updatedPassType = passType.filter(item => item.name !== name);

    setPassType(updatedPassType);
  };

  async function searchCEP(zipcode) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${zipcode.toString().trim().replaceAll("-", "")}/json/`);
      if (!response.ok) {
        throw new Error('CEP não encontrado');
      }
      const data = await response.json();


      setCity(data?.localidade)
      setUf(data?.uf)
      setAddress(data?.logradouro)
      setNeighborhood(data?.bairro)

    } catch (error) {
      console.error('Erro ao buscar informações do CEP:', error.message);
      return null;
    }
  }


  useEffect(() => {
    if (zipcode?.length == 8) {
      searchCEP(zipcode?.toString().trim().replaceAll("-", ""))
    }
  }, [zipcode])

  useEffect(() => {
    dataVerify();
  }, [name, uf, address, neighborhood, zipcode, city])

  return (
    <>
      <div className="clientEventMain flexc">
        <ToastContainer></ToastContainer>
        {!!imageToShow && <ImageModal close={() => setImageToShow('')} image={imageToShow}></ImageModal>}

        <div className="margin5percent" style={{ position: 'relative' }}>
          <div className="newTopSitemap flexc" style={{ alignItems: 'flex-start' }}>
            <h1 className=" flexr gap-2" style={{ fontWeight: 600, marginRight: 10 }}>
              <a
                href="/cliente/eventos/"
                style={{ cursor: 'pointer' }}>Eventos</a>
              <FaLongArrowAltRight />
              <span >Adicionar Evento</span>
            </h1>
            <p>Crie um evento para poder fazer as distribuições de seus ingressos de uma maneira descomplicada.</p>
          </div>

          <div className="clientEventInputBox flexc">
            <div className="inputNewStyle flexr">
              <p>Nome do Evento</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
              ></input>
            </div>

            {!!nameError && <p className="errorP" style={{ margin: '-10px 0 10px 0' }}>* O Nome deve conter mais que 3 caracteres.</p>}

            <div className="inputNewStyle flexr">
              <p>Local do Evento</p>
              <input
                onChange={(e) => setPlace(e.target.value)}
                value={place}
                type="text"
              ></input>
            </div>

            <div className="inputNewStyleDouble flexr">
              <div className="inputNewStyle flexr">
                <p>Tipo do Evento</p>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  {!!eventsType && eventsType.map((e, y) => {
                    return (
                      <option key={y} value={e.toUpperCase()}>{e}</option>
                    )
                  })}
                </select>
              </div>
              <div className="inputNewStyle flexr">
                <p style={{ textAlign: 'center' }}>Periodo</p>
                <select
                  value={subType}
                  onChange={(e) => setSubType(e.target.value)}
                >
                  {!!eventsSubType && eventsSubType.map((e, y) => {
                    return (
                      <option key={y} value={e.toUpperCase()}>{e}</option>
                    )
                  })}
                </select>
              </div>
            </div>

            <div className="inputNewStyleDouble flexr">
              <div className="inputNewStyle flexr">
                <p>Data</p>
                <input
                  onChange={(e) => setOnlyDate(e.target.value)}
                  value={onlyDate}
                  type="date"
                />
              </div>
              <div className="inputNewStyle flexr">
                <p style={{ textAlign: 'center' }}>Horário</p>
                <input
                  onChange={(e) => setOnlyHour(e.target.value)}
                  value={onlyHour}
                  type="time"
                />
              </div>
            </div>
            {!!dateError && <p className="errorP" style={{ margin: '-10px 0 10px 0' }}>* Preencha uma Data.</p>}

            <div className="inputNewStyleDouble flexr" style={{ justifyContent: 'flex-start' }}>
              <div className="inputNewStyle DoubleUnique flexr">
                <p>CEP</p>
                <input
                  onChange={(e) => setZipcode(e.target.value)}
                  value={zipcode}
                  type="number"
                />
              </div>

            </div>
            {!!cepError && <p className="errorP" style={{ margin: '-10px 0 10px 0' }}>* Preencha um CEP válido.</p>}

            <div className="inputNewStyle flexr">
              <p>Endereço</p>
              <input
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                type="text"
              ></input>
            </div>
            {!!adressError && <p className="errorP">* Preencha um Endereço.</p>}

            <div className="inputNewStyleDouble flexr">
              <div className="inputNewStyle flexr">
                <p>Número</p>
                <input
                  onChange={(e) => setNumberAdress(e.target.value)}
                  value={numberAdress}
                  type="number"
                />
              </div>
              <div className="inputNewStyle flexr">
                <p style={{ textAlign: 'center' }}>Bairro</p>
                <input
                  onChange={(e) => setNeighborhood(e.target.value)}
                  value={neighborhood}
                  type="text" />
              </div>
            </div>
            {!!adressNumberError && <p className="errorP" style={{ margin: '-10px 0 10px 0' }}>* Preencha um Numero.</p>}
            {!!neighborhoodError && <p className="errorP" style={{ margin: '-10px 0 10px 0' }}>* Preencha um Bairro.</p>}

            <div className="inputNewStyleDouble flexr">
              <div className="inputNewStyle flexr">
                <p>Cidade</p>
                <input
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                  type="text" />
              </div>
              <div className="inputNewStyle flexr">
                <p style={{ textAlign: 'center' }}>Estado</p>
                <select
                  onChange={(e) => setUf(e.target.value)}
                  value={uf}
                >
                  {statesBR.map((e, y) => {
                    return (
                      <option key={y}>{e}</option>
                    )
                  })}
                </select>
              </div>
            </div>
            {!!cityError && <p className="errorP" style={{ margin: '-10px 0 10px 0' }}>* Preencha uma Cidade.</p>}
            {!!ufError && <p className="errorP" style={{ margin: '-10px 0 10px 0' }}>* Preencha um Estado.</p>}

            <div className="inputNewStyle flexr">
              <p>Notificações</p>
              <div className="inputNotifyDiv flexr">
                <h6
                  style={notifyUsersAboutDeletingInvitations == 'SIM' ? { borderColor: '#00E1E2', borderRightWidth: '2px' } : { borderColor: 'var(--grey-ultra-ligth)', borderRightWidth: '1px' }}
                  onClick={notifyUsersAboutDeletingInvitations != 'SIM' ? (e) => setNotifyUsersAboutDeletingInvitations('SIM') : () => console.log('')}
                  className="inputNotifyDivFirst">Sim</h6>

                <h6
                  style={notifyUsersAboutDeletingInvitations == 'NAO' ? { borderColor: '#00E1E2', borderLeftWidth: '2px' } : { borderColor: 'var(--grey-ultra-ligth)', borderLeftWidth: '1px' }}
                  onClick={notifyUsersAboutDeletingInvitations != 'NAO' ? (e) => setNotifyUsersAboutDeletingInvitations('NAO') : () => console.log('')}
                  className="inputNotifyDivSecond">Não</h6>
              </div>
            </div>
          </div>
        </div>

        <div className='clientEventFilters mt-10'>
          <div className="newTopSitemap flexc" style={{ alignItems: 'flex-start' }}>
            <p style={{ color: 'var(--blue-primary)', fontWeight: '600' }}>Adicionar tipos de entrada</p>
          </div>

          <div className="clientEventInputBox flexc" style={{ paddingTop: '0' }}>
            <div className="inputNewStyleDouble flexr" style={{ justifyContent: 'flex-start' }}>
              <div className="inputNewStyle DoubleUnique flexr">
                <p>Nome do Ingresso</p>
                <input
                  onChange={(e) => setPassTypeObject({ image: passTypeObject.image, name: e.target.value })}
                  label={!!passTypeObject.name ? '' : "Tipo do Ingresso"}
                  value={passTypeObject.name}
                />
              </div>
            </div>

            <div className="inputNewStyleDouble flexr" style={{ justifyContent: 'flex-start' }}>
              <div className="inputNewStyle DoubleUnique flexr" style={{ width: '100%', paddingTop: '10px' }}>
                <p>Arte do Ingresso</p>
                <input
                  style={{ height: 'auto', backgroundColor: 'transparent', width: '100%' }}
                  onChange={(e) => setPassTypeObject({ name: passTypeObject.name, image: e.target.files[0] })}
                  value={passTypeObject.image[0]}
                  type="file"
                />
              </div>
            </div>
            <p style={{ fontSize: "12px", color: "red" }}>* Preferência de Imagem: 400px X 717px e até 2Mb</p>
            <div className="clientEventInputBox flexc" style={{ paddingTop: '0' }}>
              <div className="inputNewStyleDouble flexr" style={{ justifyContent: 'flex-start', paddingTop: '20px' }}>
                <div className="inputNewStyle DoubleUnique flexr ">
                  <p className="pNone"></p>
                  <button
                    onClick={(event) => addPassType(event)}
                    className="addPasstypeBtn flexr gap-2"><TiPlus /> {isFileUploading ? '...Loading' : 'Adicionar'}</button>
                </div>
              </div>
            </div>

            {passType?.length > 0 &&
              passType.map((e, y) => {
                console.log(e)
                return (
                  <div className="inputNewStyle flexr" key={y}>
                    <p className="pNone"></p>
                    <div className="typeLineCard flexr">
                      <div className="flexr justify-start">
                        <p style={{ color: '#FFAC25' }}>Adicionado</p>
                        <h6 style={{ backgroundColor: colors[y % colors.length] }}>{e.name}</h6>
                      </div>
                      <div className="userConfigbtns flexr">
                        <div
                          onClick={(event) => setImageToShow(e.image)}
                          className="userConfigbtn flexr">
                          <FaImage className="userConfigIcon"></FaImage></div>
                        <div
                          onClick={(event) => deletePassType(e.name, event)}
                          className="userConfigbtn flexr">
                          <DeleteIcon className="userConfigIcon"></DeleteIcon>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            }



          </div>
        </div>
        <div className="margin5percent" style={{ position: 'relative', padding: '0 !important' }}>
          <div className="clientEventInputBox flexc" style={{ padding: '50px 0' }}>
            <button
              onClick={(event) => addNewEvent(event)}
              style={{ maxHeight: '35px', minWidth: '120px' }}
              className="btnBlueThird flexr newEventBtn gap-4"
            >{!!isLoading ? <Loader></Loader> : "Salvar"}</button>
          </div>
        </div>
      </div>


    </>



    // <div className="clienteMain flexr">
    //   <ToastContainer></ToastContainer>
    //   <div className="clienteContent flexc">
    //     <div className="adminUsersHeader flexr">
    //       <div className="adminUsersTitle flexr">
    //         <h1>Novo Evento</h1>
    //       </div>
    //       <div className="adminUsersAdd flexr">
    //       </div>
    //     </div>
    //     <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>
    //     <div className="clienteUl flexc" style={{ margin: "0", padding: "30px 0" }}>
    //       <div className="userAdminDoubleInputs flexr">
    //         <TextField
    //           onChange={(e) => setName(e.target.value)}
    //           className="inputStyle"
    //           label={!!name ? '' : "Nome do Evento"}
    //           id="outlined-size-normal"
    //           placeholder={`Digite o Nome:'`}
    //           type="text" />
    //         <div className="userAdminDoubleInputsTwo flexr" style={{ width: "100%" }}>
    //           <FormControl className="InputsTwoSelect">
    //             <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
    //             <Select
    //               className="InputsTwoSelect"
    //               labelId="demo-simple-select-label"
    //               id="demo-simple-select"
    //               value={type}
    //               onChange={(e) => setType(e.target.value)}
    //             >
    //               {!!eventsType && eventsType.map((e, y) => {
    //                 return (
    //                   <MenuItem key={y} value={e.toUpperCase()}>{e}</MenuItem>
    //                 )
    //               })}
    //             </Select>
    //           </FormControl>
    //           <FormControl className="InputsTwoSelect">
    //             <InputLabel id="demo-simple-select-label">Período</InputLabel>
    //             <Select
    //               className="InputsTwoSelect"
    //               labelId="demo-simple-select-label"
    //               id="demo-simple-select"
    //               value={subType}
    //               onChange={(e) => setSubType(e.target.value)}
    //             >
    //               {!!eventsSubType && eventsSubType.map((e, y) => {
    //                 return (
    //                   <MenuItem key={y} value={e.toUpperCase()}>{e}</MenuItem>
    //                 )
    //               })}
    //             </Select>
    //           </FormControl>
    //           <FormControl className="InputsTwoSelect">
    //             <InputLabel id="demo-simple-select-label">Notificações</InputLabel>
    //             <Select
    //               className="InputsTwoSelect"
    //               labelId="demo-simple-select-label"
    //               id="demo-simple-select"
    //               value={notifyUsersAboutDeletingInvitations}
    //               onChange={(e) => setNotifyUsersAboutDeletingInvitations(e.target.value)}
    //             >
    //               <MenuItem value={"SIM"}>Sim</MenuItem>
    //               <MenuItem value={"NAO"}>Não</MenuItem>
    //             </Select>
    //           </FormControl>
    //         </div>
    //       </div>
    //       {!!nameError && <p className="errorP">* O Nome deve conter mais que 3 caracteres.</p>}
    //       <div className="userAdminDoubleInputs flexr">
    //         <TextField
    //           onChange={(e) => setDate(e.target.value)}
    //           className="inputStyle"
    //           id="outlined-size-normal"
    //           value={date}
    //           placeholder={`Digite a Data:'`}
    //           type={"datetime-local"} />
    //         <TextField
    //           onChange={(e) => setZipcode(e.target.value)}
    //           className="inputStyle"
    //           label={!!zipcode ? '' : "CEP"}
    //           id="outlined-size-normal"
    //           placeholder={`Digite o CEP:'`}
    //           type="number" />
    //       </div>
    //       {!!dateError && <p className="errorP">* Preencha uma Data.</p>}
    //       {!!cepError && <p className="errorP" style={{ textAlign: "right" }}>* Preencha um CEP.</p>}
    //       <div className="userAdminDoubleInputs flexr">
    //         <TextField
    //           onChange={(e) => setPlace(e.target.value)}
    //           className="inputStyle"
    //           label={!!place ? '' : "Local do evento"}
    //           value={place || ''}
    //           id="outlined-size-normal"
    //           placeholder={`Local do evento:'`}
    //           type="text" />
    //         <TextField
    //           onChange={(e) => setAddress(e.target.value)}
    //           className="inputStyle"
    //           label={!!address ? '' : "Rua"}
    //           value={address || ''}
    //           id="outlined-size-normal"
    //           placeholder={`Nome da Rua:'`}
    //           type="text" />
    //       </div>
    //       <div className="userAdminDoubleInputs flexr">
    //         <TextField
    //           onChange={(e) => setNumberAdress(e.target.value)}
    //           className="inputStyle"
    //           value={numberAdress || ''}
    //           label={!!numberAdress ? '' : "Numero"}
    //           id="outlined-size-normal"
    //           placeholder={`Digite o Numero:'`}
    //           type="number" />
    //         <TextField
    //           onChange={(e) => setNeighborhood(e.target.value)}
    //           className="inputStyle"
    //           value={neighborhood || ''}
    //           label={!!neighborhood ? '' : "Bairro"}
    //           id="outlined-size-normal"
    //           placeholder={`Digite o Bairro:'`}
    //           type="text" />
    //         <TextField
    //           onChange={(e) => setCity(e.target.value)}
    //           className="inputStyle"
    //           value={city || ''}
    //           label={!!city ? '' : "Cidade"}
    //           id="outlined-size-normal"
    //           placeholder={`Digite a Cidade:'`}
    //           type="text" />
    //         <TextField
    //           onChange={(e) => setUf(e.target.value)}
    //           className="inputStyle"
    //           label={!!uf ? '' : "Estado"}
    //           value={uf || ''}
    //           id="outlined-size-normal"
    //           placeholder={`Digite o Estado:'`}
    //           type="text" />
    //       </div>

    //       {!!adressError && <p className="errorP">* Preencha um Endereço.</p>}
    //       {!!adressNumberError && <p className="errorP">* Preencha um Numero.</p>}
    //       {!!neighborhoodError && <p className="errorP">* Preencha um Bairro.</p>}
    //       {!!cityError && <p className="errorP">* Preencha uma Cidade.</p>}
    //       {!!ufError && <p className="errorP">* Preencha um Estado.</p>}
    //     </div>
    //     <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>
    //     <div className="passTypeHeader flexr">
    //       <div className="passTypeTitle flexr">
    //         <h1>Tipo de Entrada</h1>
    //       </div>
    //       <div className="passTypeBlockFirts flexr">
    //         <TextField
    //           onChange={(e) => setPassTypeObject({ image: passTypeObject.image, name: e.target.value })}
    //           className="inputStyle"
    //           label={!!passTypeObject.name ? '' : "Tipo do Ingresso"}
    //           value={passTypeObject.name}
    //           id="outlined-size-normal"
    //           placeholder={`Tipo do Ingresso:`}
    //           type="text" />
    //         <TextField
    //           onChange={(e) => setPassTypeObject({ name: passTypeObject.name, image: e.target.files[0] })}
    //           className="inputStyle"
    //           value={passTypeObject.image[0]}
    //           id="outlined-size-normal"
    //           type="file" />
    //         <button
    //           onClick={(event) => addPassType(event)}
    //           style={{ minWidth: "110px", fontSize: "16px" }}
    //           className="btnBlue">Adicionar</button>
    //       </div>
    //     </div>
    //     <div className="passTypeFull flexc">
    //       <div className="passTypeBlock flexr">
    //         {passType?.length > 0 &&
    //           passType.map((e, y) => {

    //             return (
    //               <div
    //                 key={y}
    //                 className="passTypeBlockItem flexr">
    //                 <p>{e.name}</p>
    //                 <CloseIcon
    //                   className="passTypeBlockIcon"
    //                   onClick={(event) => deletePassType(e.name, event)}
    //                   style={{ color: "#000000" }}></CloseIcon>
    //               </div>
    //             )
    //           })
    //         }
    //       </div>
    //     </div >
    //     <div className="adminUsersHeader flexr">
    //       <div className="adminUsersAdd flexr">
    //         <button
    //           onClick={(event) => addNewEvent(event)}
    //           style={{ minWidth: "150px" }}
    //           className="btnOrange">{!!isLoading ? <Loader></Loader> : "Salvar"}</button>
    //       </div>
    //     </div>
    //   </div>
    // </div >
  );
}
